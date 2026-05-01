import { createFileRoute } from "@tanstack/react-router";
import { getSupabaseServiceClient } from "@/lib/supabase-server";

export const Route = createFileRoute("/api/admin/users")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const supabase = getSupabaseServiceClient();
          const { data, error } = await supabase.auth.admin.listUsers();

          if (error) {
            return new Response(
              JSON.stringify({ error: error.message }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          const users = (data.users || []).map((u) => ({
            id: u.id,
            email: u.email,
            role: (u.user_metadata?.role as string) || "client",
            created_at: u.created_at,
          }));

          return new Response(JSON.stringify({ users }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          return new Response(
            JSON.stringify({ error: String(error) }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
