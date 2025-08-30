// src/pages/api/auth/complete-reset.ts
export const prerender = false;

import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

function redirect303(location: string) {
  return new Response(null, { status: 303, headers: { Location: location } });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Accept form or JSON
    let accessToken = "", newPassword = "", confirmPassword = "";
    const ctype = request.headers.get("content-type") || "";
    if (ctype.includes("application/json")) {
      const body = await request.json().catch(() => ({}));
      accessToken = (body.access_token || "").trim();
      newPassword = (body.newPassword || "").trim();
      confirmPassword = (body.confirmPassword || "").trim();
    } else {
      const form = await request.formData();
      accessToken = String(form.get("access_token") || "").trim();
      newPassword = String(form.get("newPassword") || "").trim();
      confirmPassword = String(form.get("confirmPassword") || "").trim();
    }

    if (!accessToken) return redirect303("/update-password?err=norecovery");
    if (!newPassword || !confirmPassword) return redirect303("/update-password?err=missing");
    if (newPassword.length < 8) return redirect303("/update-password?err=short");
    if (newPassword !== confirmPassword) return redirect303("/update-password?err=nomatch");

    // Verify the token belongs to a valid user
    const { data, error } = await supabaseAdmin.auth.getUser(accessToken);
    if (error || !data?.user) {
      return redirect303("/update-password?err=invalid");
    }

    // Update the password with Admin API
    const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(
      data.user.id,
      { password: newPassword }
    );
    if (updateErr) {
      return redirect303("/update-password?err=update");
    }

    // Render tiny interstitial that sets the login success flag and jumps to /login
    const html = `<!doctype html>
<meta charset="utf-8">
<script>
  try { sessionStorage.setItem('pw_changed', '1'); } catch (e) {}
  location.replace('/login');
</script>`;
    return new Response(html, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } });
  } catch (e) {
    console.error("complete-reset error:", e);
    return redirect303("/update-password?err=server");
  }
};

export const GET: APIRoute = async () =>
  new Response("Method Not Allowed", { status: 405 });
