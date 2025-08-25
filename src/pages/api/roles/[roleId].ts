// src/pages/api/roles/[roleId].ts
export const prerender = false;

import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

// --- Admin guard (checks DB roles, not metadata) ---
async function requireAdmin(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const m = cookieHeader.match(/(?:^|;\s*)sb-access-token=([^;]+)/);
  const token = m ? decodeURIComponent(m[1]) : null;

  if (!token) {
    return { ok: false as const, status: 401, msg: 'Unauthorized: no access token' };
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) {
    return { ok: false as const, status: 401, msg: 'Unauthorized: invalid token' };
  }

  const userId = data.user.id;

  // roles(name) may come back as an array or single object depending on join;
  // treat it generically to avoid TS 'never' issues.
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

export const DELETE: APIRoute = async ({ params, request }) => {
  // Require admin
  const guard = await requireAdmin(request);
  if (!guard.ok) {
    return new Response(JSON.stringify({ error: guard.msg }), {
      status: guard.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const roleId = params.roleId;
  if (!roleId) {
    return new Response(JSON.stringify({ error: 'roleId is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Optional: ensure the role exists
    const { data: roleExists, error: roleFetchErr } = await supabaseAdmin
      .from('roles')
      .select('id')
      .eq('id', roleId)
      .single();

    if (roleFetchErr || !roleExists) {
      return new Response(JSON.stringify({ error: 'Role not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1) Delete assignments
    const { error: delAssignErr } = await supabaseAdmin
      .from('user_roles')
      .delete()
      .eq('role_id', roleId);

    if (delAssignErr) {
      return new Response(JSON.stringify({ error: delAssignErr.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2) Delete the role itself
    const { error: delRoleErr } = await supabaseAdmin
      .from('roles')
      .delete()
      .eq('id', roleId);

    if (delRoleErr) {
      return new Response(JSON.stringify({ error: delRoleErr.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Role deleted' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err?.message || 'Unexpected server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
