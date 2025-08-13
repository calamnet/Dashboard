// src/pages/api/list-users.ts
export const prerender = false;

import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import type { User } from '@supabase/supabase-js'; // import the User type

interface UserWithRoles {
  id: string;
  email: string | null;
  roles: string[];
  confirmed_at: string | null;
}

export const GET: APIRoute = async () => {
  try {
    const { data: allUsers, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) throw error;
    if (!allUsers) return new Response('No users found', { status: 404 });

    // Explicitly type the parameter 'u' as User
    const users: UserWithRoles[] = allUsers.map((u: User) => ({
      id: u.id,
      email: u.email ?? null,
      roles: u.user_metadata?.roles ?? [],
      confirmed_at: u.confirmed_at ?? null,
    }));

    return new Response(JSON.stringify(users), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('List users error:', err);
    return new Response(err instanceof Error ? err.message : JSON.stringify(err), { status: 500 });
  }
};
