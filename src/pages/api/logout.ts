import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabaseClient';

export const POST: APIRoute = async ({ request, redirect }) => {
  const contentType = request.headers.get('content-type') || '';

  try {
    // If this ever needs extra fields in the body, we can parse like register.ts
    // but for now logout doesn't require any data.
    if (
      !contentType.includes('application/json') &&
      !contentType.includes('application/x-www-form-urlencoded') &&
      !contentType.includes('multipart/form-data')
    ) {
      return new Response('Unsupported content type', { status: 400 });
    }
  } catch (err) {
    return new Response('Invalid request body', { status: 400 });
  }

  const { error } = await supabase.auth.signOut();

  if (error) {
    return new Response(error.message, { status: 400 });
  }

  return redirect('/');
};
