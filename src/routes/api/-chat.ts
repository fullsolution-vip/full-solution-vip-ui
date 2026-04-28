import { createFileRoute } from "@tanstack/react-router";
import { chatService } from "@/lib/chatbot/chat-service";
import { z } from "zod";
import { logger } from "@/lib/logger";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const startTime = Date.now();
        try {
          const body = await request.json();
          logger.info("api/chat", "Received chat request", body);
          
          const schema = z.object({
            message: z.string().min(1).max(2000),
            sessionId: z.string().min(1),
          });
          
          const { message, sessionId } = schema.parse(body);
          logger.debug("api/chat", `Processing message for session ${sessionId.slice(0, 8)}...`);
          
          const response = await chatService.generateResponse(sessionId, message);
          
          logger.info("api/chat", `Request completed in ${Date.now() - startTime}ms`);
          return Response.json(response);
        } catch (error) {
          logger.error("api/chat", "Chat request failed:", error);
          return Response.json(
            { error: String(error), message: "Failed to process request" },
            { status: 400 }
          );
        }
      },
    },
  },
});
