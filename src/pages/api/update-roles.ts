// src/pages/api/update-roles.ts
export const prerender = false;

import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

// --- Admin guard (checks DB roles, not metadata) ---
async function requireAdmin(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const m = cookieHeader.match(/(?:^|;\s*)sb-access-token=([^;]+)/);
  const token = m ? decodeURIComponent(m[1]) : null;

  if (!token) return { ok: false as const, status: 401, msg: 'Unauthorized: no access token' };

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) {
    return { ok: false as const, status: 401, msg: 'Unauthorized: invalid token' };
  }

  const userId = data.user.id;
  type RoleNameObj = { name: string };
  type AdminRow = { roles: RoleNameObj[] | RoleNameObj | null };

  const { data: rows, error: rolesErr } = await supabaseAdmin
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', userId);

  if (rolesErr) {
    console.error('admin guard roles query error:', rolesErr.message);
    return { ok: false as const, status: 500, msg: 'Server error' };
  }

  const normalized = (rows ?? []) as AdminRow[];
  const callerRoleNames = normalized.flatMap((r) => {
    const rs = r.roles;
    if (Array.isArray(rs)) return rs.map((x) => x?.name).filter(Boolean) as string[];
    if (rs && typeof rs === 'object' && 'name' in rs && rs.name) return [String(rs.name)];
    return [];
  });

  const isAdmin = callerRoleNames.includes('administrator');
  if (!isAdmin) return { ok: false as const, status: 403, msg: 'Forbidden' };
  return { ok: true as const };
}

type UsersPayload = Record<string, string[]>; // { [userId]: ["administrator","basic", ...] }
type RoleRow = { id: string; name: string };
type JoinedUserRoleRow = { role_id: string; roles: { name: string }[] | { name: string } | null };

export const POST: APIRoute = async ({ request }) => {
  // Require admin
  const guard = await requireAdmin(request);
  if (!guard.ok) {
    return new Response(JSON.stringify({ error: guard.msg }), {
      status: guard.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const users = (body?.users ?? null) as UsersPayload | null;

    if (!users || typeof users !== 'object') {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Cache all roles (name -> id)
    const { data: allRoles, error: rolesErr } = await supabaseAdmin
      .from('roles')
      .select('id,name');

    if (rolesErr || !allRoles) {
      return new Response(JSON.stringify({ error: rolesErr?.message || 'Unable to load roles' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const roleNameToId = new Map<string, string>((allRoles as RoleRow[]).map(r => [r.name, r.id]));

    for (const [userId, desiredRoleNames] of Object.entries(users)) {
      // Current roles (joined → names)
      const { data: existingJoined, error: existingErr } = await supabaseAdmin
        .from('user_roles')
        .select('role_id, roles(name)')
        .eq('user_id', userId);

      if (existingErr) {
        console.error('read user_roles error:', existingErr.message, { userId });
        continue;
      }

      const joinedRows = (existingJoined ?? []) as JoinedUserRoleRow[];
      const existingRoleNames: string[] = joinedRows.flatMap((row) => {
        const rs = row.roles;
        if (Array.isArray(rs)) return rs.map((x) => x?.name).filter(Boolean) as string[];
        if (rs && typeof rs === 'object' && 'name' in rs && rs.name) return [String(rs.name)];
        return [];
      });

      // Safety: avoid mass delete if join parsing fails
      const allowRemovals = joinedRows.length === 0 || existingRoleNames.length > 0;

      const desiredUnique = Array.from(new Set(desiredRoleNames));
      const toAddNames = desiredUnique.filter(n => !existingRoleNames.includes(n));
      const toRemoveNames = allowRemovals
        ? existingRoleNames.filter(n => !desiredUnique.includes(n))
        : [];

      // Add
      if (toAddNames.length > 0) {
        const toInsert = toAddNames
          .map(n => roleNameToId.get(n))
          .filter(Boolean)
          .map(rid => ({ user_id: userId, role_id: rid as string }));
        if (toInsert.length > 0) {
          const { error: insertErr } = await supabaseAdmin.from('user_roles').insert(toInsert);
          if (insertErr) console.error('insert user_roles error:', insertErr.message, { userId, toInsert });
        }
      }

      // Remove
      for (const name of toRemoveNames) {
        const rid = roleNameToId.get(name);
        if (!rid) continue;
        const { error: delErr } = await supabaseAdmin
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role_id', rid);
        if (delErr) console.error('delete user_roles error:', delErr.message, { userId, rid });
      }

      // Optional: sync metadata to match DB (keeps UI consistent)
      const { error: metaErr } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: { roles: desiredUnique },
      });
      if (metaErr) console.warn('metadata sync warning:', metaErr.message, { userId });
    }

    return new Response(JSON.stringify({ message: 'Roles updated successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err?.message || 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
