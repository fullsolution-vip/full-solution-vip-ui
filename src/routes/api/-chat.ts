import { createFileRoute } from "@tanstack/react-router";
import { chatService } from "@/lib/chatbot/chat-service";
import { z } from "zod";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const schema = z.object({
            message: z.string().min(1).max(2000),
            sessionId: z.string().min(1),
          });
          
          const { message, sessionId } = schema.parse(body);
          const response = await chatService.generateResponse(sessionId, message);
          return Response.json(response);
        } catch (error) {
          return Response.json(
            { error: String(error) },
            { status: 400 }
          );
        }
      },
    },
  },
});
