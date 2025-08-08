// src/pages/logout.ts
import { supabase } from '../lib/supabaseClient'
import { redirect } from 'astro/runtime/server'

export async function POST() {
  await supabase.auth.signOut()
  return redirect('/')
}