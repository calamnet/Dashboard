// src/pages/api/auth/forgot-password.ts
export const prerender = false;

import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

function redirect303(location: string) {
  return new Response(null, { status: 303, headers: { Location: location } });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse body (form or JSON)
    let email = "";
    const ctype = request.headers.get("content-type") || "";
    if (ctype.includes("application/json")) {
      const body = await request.json().catch(() => ({}));
      email = (body.email || "").trim();
    } else {
      const form = await request.formData();
      email = String(form.get("email") || "").trim();
    }
    if (!email) return redirect303("/forgot-password?err=missing");

    // Build absolute redirect URL for the email link
    const origin = new URL(request.url).origin; // e.g., http://localhost:3000
    const redirectTo = `${origin}/update-password`;

    // Supabase anon client (server-side)
    const supabase = createClient(
      import.meta.env.SUPABASE_URL!,
      import.meta.env.SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
    );

    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) {
      console.error("resetPasswordForEmail error:", error);
      return redirect303("/forgot-password?err=bad");
    }

    return redirect303("/forgot-password?sent=1");
  } catch (e) {
    console.error("forgot-password API error:", e);
    return redirect303("/forgot-password?err=bad");
  }
};

export const GET: APIRoute = async () =>
  new Response("Method Not Allowed", { status: 405 });
