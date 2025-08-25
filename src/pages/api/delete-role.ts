export const prerender = false;

import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../lib/supabaseAdmin";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { roleId } = await request.json();

    if (!roleId) {
      return new Response("Role ID is required", { status: 400 });
    }

    // Remove role assignments first
    const { error: userRolesError } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("role_id", roleId);

    if (userRolesError) {
      console.error("Error removing role from user_roles:", userRolesError.message);
      return new Response("Failed to remove role assignments", { status: 500 });
    }

    // Now delete the role itself
    const { error: roleError } = await supabaseAdmin
      .from("roles")
      .delete()
      .eq("id", roleId);

    if (roleError) {
      console.error("Error deleting role:", roleError.message);
      return new Response("Failed to delete role", { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Unexpected error deleting role:", err);
    return new Response("Unexpected error", { status: 500 });
  }
};
