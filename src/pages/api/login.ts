// src/pages/api/login.ts
export const prerender = false; // allow runtime requests

import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabaseClient';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    console.log('--- Incoming Login Request ---');

    // Log all request headers
    const headersObj = Object.fromEntries(request.headers.entries());
    console.log('Headers:', headersObj);

    // Parse form data
    const formData = await request.formData();
    const formEntries = Array.from(formData.entries());
    console.log('Form Data:', formEntries);

    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';

    if (!email || !password) throw new Error('Email and password required');

    console.log('Attempting Supabase login for:', email);

    // Attempt login
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('Supabase login error:', error);
      throw new Error(error.message);
    }

    if (!data.session) throw new Error('No session returned');

    console.log('Login successful:', data.user?.email);

    // Store access token in cookie
    cookies.set('sb-access-token', data.session.access_token, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return redirect('/dashboard');
  } catch (err) {
    console.error('Login error caught:', err);
    return new Response(err instanceof Error ? err.message : JSON.stringify(err), { status: 400 });
  }
};
