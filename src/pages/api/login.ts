import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabaseClient';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const email = formData.get('email')?.toString() || '';
  const password = formData.get('password')?.toString() || '';

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return new Response(error.message, { status: 400 });
  }

  cookies.set('sb-access-token', data.session.access_token, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  return redirect('/dashboard');
};
