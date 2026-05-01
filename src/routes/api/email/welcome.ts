import { createFileRoute } from "@tanstack/react-router";
import { emailService } from "@/lib/email";

export const Route = createFileRoute("/api/email/welcome")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { name, email } = body as { name: string; email: string };

          if (!email) {
            return new Response(JSON.stringify({ error: "Email required" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const result = await emailService.sendWelcomeEmail({
            name: name || "",
            email,
          });

          return new Response(JSON.stringify(result), {
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
