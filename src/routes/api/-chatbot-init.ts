import { createServerFn } from "@tanstack/react-start";
import { processKnowledgeBase } from "@/lib/chatbot/knowledge-loader";

export const $reloadKnowledgeBase = createServerFn({ method: "POST" })
  .handler(async () => {
    try {
      await processKnowledgeBase();
      return { success: true, message: "Knowledge base reloaded successfully" };
    } catch (error) {
      throw new Error("Failed to reload knowledge base: " + String(error));
    }
  });
