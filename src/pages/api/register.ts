// src/pages/api/register.ts
export const prerender = false;

import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabaseClient";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }

  // --- Create user with "Basic" role in user_metadata ---
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        roles: ["Basic"], // Always assign Basic role
      },
    },
  });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  const newUser = data.user;
  if (!newUser) {
    return new Response("User creation failed", { status: 500 });
  }

  // --- Ensure "Basic" role exists in roles table ---
  const { data: rolesData } = await supabaseAdmin
    .from("roles")
    .select("*")
    .eq("name", "Basic");
  let basicRole = rolesData?.[0];

  if (!basicRole) {
    const { data: insertedRole } = await supabaseAdmin
      .from("roles")
      .insert({ name: "Basic" })
      .select()
      .single();
    basicRole = insertedRole;
  }

  // --- Insert into user_roles ---
  if (basicRole) {
    await supabaseAdmin.from("user_roles").insert({
      user_id: newUser.id,
      role_id: basicRole.id,
    });
  }

  // Redirect to login for email verification
  return redirect("/login?message=verify-email");
};
