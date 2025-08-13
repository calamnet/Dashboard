// src/pages/api/update-roles.ts
export const prerender = false;

import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const userId = formData.get('userId')?.toString();
    const rolesString = formData.get('roles')?.toString();

    if (!userId || !rolesString) {
      return new Response('Missing userId or roles', { status: 400 });
    }

    const roles = rolesString.split(',').map(r => r.trim()).filter(Boolean);

    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { roles }
    });

    if (error) {
      return new Response(`Error updating roles: ${error.message}`, { status: 500 });
    }

    // Redirect back to the admin dashboard
    return new Response(null, {
      status: 303,
      headers: { Location: '/admin-dashboard' }
    });
  } catch (err: any) {
    return new Response(`Unexpected error: ${err.message || 'Unknown error'}`, { status: 500 });
  }
};
