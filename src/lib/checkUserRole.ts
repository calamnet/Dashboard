// src/lib/checkUserRole.ts
import { supabase } from './supabaseClient';

export async function checkUserRole(token: string | undefined, requiredRoles: string[] = []) {
  if (!token) return null;

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;

  const roles: string[] = data.user.app_metadata?.roles || [];

  const hasRoles = requiredRoles.every(role => roles.includes(role));
  if (!hasRoles) return null;

  return data.user;
}
