// src/pages/api/set-session.ts
export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabaseClient';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    const { access_token } = await request.json();

    if (!access_token) {
      return new Response('Missing access token', { status: 400 });
    }

    // Validate token with Supabase
    const { data, error } = await supabase.auth.getUser(access_token);

    if (error || !data.user) {
      return new Response('Invalid token', { status: 401 });
    }

    // Store the token in an httpOnly cookie
    cookies.set('sb-access-token', access_token, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Redirect to dashboard
    return redirect('/dashboard');
  } catch (err: any) {
    console.error(err);
    return new Response(err.message || 'Unknown error', { status: 500 });
  }
};
