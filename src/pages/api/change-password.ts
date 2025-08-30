// src/pages/api/change-password.ts
export const prerender = false;

import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

function redirect303(location: string) {
  return new Response(null, { status: 303, headers: { Location: location } });
}

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // 0) Auth: who is making this request?
    const accessToken = cookies.get("sb-access-token")?.value;
    if (!accessToken) return redirect303("/login");

    const { data, error } = await supabaseAdmin.auth.getUser(accessToken);
    if (error || !data?.user) return redirect303("/login");
    const user = data.user;

    // 1) Read form fields (supports form-encoded & JSON)
    let currentPassword = "";
    let newPassword = "";
    let confirmPassword = "";

    const ctype = request.headers.get("content-type") || "";
    if (ctype.includes("application/json")) {
      const body = await request.json().catch(() => ({}));
      currentPassword = (body.currentPassword || "").trim();
      newPassword = (body.newPassword || "").trim();
      confirmPassword = (body.confirmPassword || "").trim();
    } else {
      const form = await request.formData();
      currentPassword = String(form.get("currentPassword") || "").trim();
      newPassword = String(form.get("newPassword") || "").trim();
      confirmPassword = String(form.get("confirmPassword") || "").trim();
    }

    // 2) Validate
    if (!currentPassword || !newPassword || !confirmPassword) {
      return redirect303("/account/change-password?err=missing");
    }
    if (newPassword.length < 8) {
      return redirect303("/account/change-password?err=short");
    }
    if (newPassword !== confirmPassword) {
      return redirect303("/account/change-password?err=nomatch");
    }

    // 3) Verify current password by attempting a sign-in with a NON-persisting anon client
    const supabaseAnon = createClient(
      import.meta.env.SUPABASE_URL!,
      import.meta.env.SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    );

    const { error: signinErr } = await supabaseAnon.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    });

    if (signinErr) {
      return redirect303("/account/change-password?err=badpass");
    }

    // 4) Update password using Admin API
    const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );
    if (updateErr) {
      return redirect303("/account/change-password?err=update");
    }

    // 5) Clear user's auth cookies so they must re-login
    cookies.delete("sb-access-token", { path: "/" });
    cookies.delete("sb-refresh-token", { path: "/" });

    // 6) Ultra-minimal interstitial: set a one-time sessionStorage flag, then go to /login
    const html = `<!doctype html>
<meta charset="utf-8">
<script>
  try { sessionStorage.setItem('pw_changed', '1'); } catch (e) {}
  location.replace('/login');
</script>`;
    return new Response(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (e) {
    console.error("change-password API error:", e);
    return redirect303("/account/change-password?err=server");
  }
};

// Optional: block GET
export const GET: APIRoute = async () =>
  new Response("Method Not Allowed", { status: 405 });
