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
              huggingface: "unknown",
              redis: "unknown",
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

          // Check Hugging Face
          const hfKey = process.env.HUGGINGFACE_API_KEY;
          health.services.huggingface = hfKey ? "configured" : "missing_key";

          // Check Redis
          const redisUrl = process.env.REDIS_URL || process.env.LANGCACHE_URL;
          health.services.redis = redisUrl ? "configured" : "not_configured";

          const allHealthy = Object.values(health.services).every(
            (s) => s === "ok" || s === "configured",
          );

          return Response.json(health, {
            status: allHealthy ? 200 : 503,
          });
        } catch (error) {
          logger.error("health-check", "Health check failed", error);
          return Response.json({ status: "error", message: String(error) }, { status: 500 });
        }
      },
    },
  },
});
