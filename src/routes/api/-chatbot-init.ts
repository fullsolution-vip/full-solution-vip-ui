import { createFileRoute } from "@tanstack/react-router";
import { processKnowledgeBase, initializeKnowledgeBase } from "@/lib/chatbot/knowledge-loader";
import { retrievalService } from "@/lib/chatbot/retrieval-service";
import { cacheService } from "@/lib/chatbot/cache-service";
import { logger } from "@/lib/logger";

export const Route = createFileRoute("/api/chatbot-init")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const force = new URL(request.url).searchParams.get("force") === "true";
          logger.info("api/chatbot-init", `Initializing knowledge base (force: ${force})...`);
          
          const beforeCount = await retrievalService.getKnowledgeCount();
          logger.info("api/chatbot-init", `Before: ${beforeCount} chunks in DB`);
          
          if (force) {
            // Force re-process all files
            await processKnowledgeBase();
          } else {
            // Normal init (skips unchanged files)
            await initializeKnowledgeBase();
          }
          
          const afterCount = await retrievalService.getKnowledgeCount();
          logger.info("api/chatbot-init", `After: ${afterCount} chunks in DB`);
          
          // Get sample rows from Supabase
          const sampleRows = await retrievalService.getSampleRows(3);
          
          // Check Redis cache
          const testKey = "health:check:" + Date.now();
          await cacheService.set(testKey, "test", 10);
          const redisOk = (await cacheService.get(testKey)) === "test";
          
          return Response.json({
            success: true,
            message: `Knowledge base updated. Before: ${beforeCount}, After: ${afterCount}`,
            supabase: {
              rowsInserted: afterCount - beforeCount,
              totalRows: afterCount,
              sampleRows: sampleRows.map((row) => ({
                id: row.id?.slice(0, 8),
                source: row.source_file,
                chunk: row.chunk_index,
                preview: row.content?.slice(0, 50) + "...",
                created: row.created_at,
              })),
            },
            redis: {
              status: redisOk ? "connected" : "not_connected",
              test: redisOk ? "passed" : "failed",
            },
            nextStep: "Visit /api-docs to see API documentation",
          });
        } catch (error) {
          logger.error("api/chatbot-init", "Failed to reinitialize:", error);
          return Response.json(
            { success: false, message: String(error) },
            { status: 500 }
          );
        }
      },
    },
  },
});
