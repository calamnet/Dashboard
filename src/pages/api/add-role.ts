// src/pages/api/add-role.ts
export const prerender = false;

import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const name = formData.get("name")?.toString().trim();

    if (!name) {
      return new Response("Role name is required", { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("roles")
      .insert([{ name }]); // Postgres will generate `id`

    if (error) {
      console.error("Error adding role:", error);
      return new Response(error.message, { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return new Response("Unexpected error", { status: 500 });
  }
};
