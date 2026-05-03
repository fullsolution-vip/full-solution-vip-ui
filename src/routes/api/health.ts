import { createFileRoute } from "@tanstack/react-router";
import { getSupabase } from "@/lib/supabase";
import { logger } from "@/lib/logger";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        try {
          logger.info("health-check", "Checking system health...");

          const health = {
            status: "ok",
            timestamp: new Date().toISOString(),
            services: {
              supabase: "unknown",
              groq: "unknown",
              redis: "unknown",
              resend: "unknown",
            },
          };

          // Check Supabase
          try {
            const supabase = getSupabase();
            const { error } = await supabase.from("chatbot_sessions").select("count").limit(0);
            health.services.supabase = error ? "error" : "ok";
          } catch (e) {
            health.services.supabase = "error";
            logger.error("health-check", "Supabase connection failed", e);
          }

          // Check Groq
          const groqKey = process.env.GROQ_API_KEY;
          const groqModel = process.env.GROQ_MODEL;
          health.services.groq = (groqKey && groqModel) ? "configured" : "missing_config";

          // Check Redis
          const redisUrl = process.env.REDIS_URL || process.env.LANGCACHE_URL;
          health.services.redis = redisUrl ? "configured" : "not_configured";

          // Check Resend
          const resendKey = process.env.RESEND_API_KEY;
          health.services.resend = resendKey ? "configured" : "missing_config";

          const allHealthy = Object.values(health.services).every(
            (s) => s === "ok" || s === "configured",
          );

          return new Response(JSON.stringify(health), {
            status: allHealthy ? 200 : 503,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          logger.error("health-check", "Health check failed", error);
          return Response.json({ status: "error", message: String(error) }, { status: 500 });
        }
      },
    },
  },
});
