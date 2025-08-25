// src/pages/api/roles/index.ts
export const prerender = false;

import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

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

type RoleRow = { id: string; name: string };

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
    const rawName = (body?.name ?? '').toString().trim();

    if (!rawName) {
      return new Response(JSON.stringify({ error: 'Role name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data, error } = await supabaseAdmin
      .from('roles')
      .insert({ name: rawName })
      .select('id,name')
      .single<RoleRow>();

    if (error) {
      // Optional: handle duplicate name (unique constraint) as 409
      const msg = error.message || 'Insert failed';
      const status = /duplicate/i.test(msg) ? 409 : 500;
      return new Response(JSON.stringify({ error: msg }), {
        status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ role: data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Unexpected server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
