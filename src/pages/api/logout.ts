// src/pages/api/logout.ts
export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabaseClient';

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const accessToken = cookies.get('sb-access-token')?.value;

    // Revoke Supabase session if token exists
    if (accessToken) {
      const { error } = await supabase.auth.signOut();
      if (error) console.error('Supabase logout error:', error.message);
    }

    // Clear the cookie
    cookies.set('sb-access-token', '', {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'strict',
      expires: new Date(0), // expire immediately
    });

    // Redirect to home page
    return new Response(null, {
      status: 303,
      headers: { Location: '/' },
    });
  } catch (err: any) {
    console.error('Logout error:', err);
    return new Response(err.message || 'Unknown error', { status: 500 });
  }
};
