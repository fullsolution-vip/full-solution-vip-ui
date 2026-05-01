import { createFileRoute } from "@tanstack/react-router";
import { emailService } from "@/lib/email";
import { getSupabaseServiceClient } from "@/lib/supabase-server";

export const Route = createFileRoute("/api/leads")({
  server: {
    handlers: {
      // Submit a lead (public)
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const {
            type,
            companyName,
            contactName,
            email,
            phone,
            productInterests,
            estimatedVolume,
            message,
          } = body as {
            type: "application" | "sample_request" | "catalogue_download";
            companyName?: string;
            contactName: string;
            email: string;
            phone?: string;
            productInterests?: string[];
            estimatedVolume?: string;
            message?: string;
          };

          if (!contactName || !email || !type) {
            return new Response(
              JSON.stringify({ error: "Name, email, and type are required" }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          // Store in Supabase (leads table — create if not exists)
          const supabase = getSupabaseServiceClient();

          // Try to insert — if table doesn't exist, we'll still send the email
          try {
            await supabase.from("leads").insert({
              type,
              company_name: companyName,
              contact_name: contactName,
              email,
              phone,
              product_interests: productInterests,
              estimated_volume: estimatedVolume,
              message,
            });
          } catch (dbError) {
            console.warn("Leads table not found — email still sent:", dbError);
          }

          // Send notification to admin
          const result = await emailService.notifyLead({
            type,
            name: contactName,
            email,
            company: companyName,
            message,
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
