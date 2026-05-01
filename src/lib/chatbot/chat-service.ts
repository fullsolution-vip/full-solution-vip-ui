import { retrievalService } from "./retrieval-service";
import { cacheService } from "./cache-service";
import { logger } from "@/lib/logger";

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY || "";
const HF_MODEL =
  process.env.HUGGINGFACE_API_URL ||
  "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatResponse {
  message: string;
  sources: string[];
  cached: boolean;
}

export class ChatService {
  async generateResponse(
    sessionId: string,
    userMessage: string,
    systemPrompt?: string,
  ): Promise<ChatResponse> {
    const startTime = Date.now();
    logger.info("chat-service", `Generating response for session ${sessionId.slice(0, 8)}...`, {
      message: userMessage,
    });

    try {
      const cacheKey = cacheService.generateKey("response", sessionId, userMessage);
      const cached = await cacheService.getJSON<ChatResponse>(cacheKey);
      if (cached) {
        logger.info("chat-service", "Returning cached response");
        return { ...cached, cached: true };
      }

      logger.debug("chat-service", "Fetching relevant chunks and recent messages...");

      const [relevantChunks, recentMessages] = await Promise.all([
        retrievalService.similaritySearch(userMessage, 0.7, 5),
        retrievalService.getRecentMessages(sessionId, 10) as Promise<
          Array<{ role: string; content: string }>
        >,
      ]);

      logger.info("chat-service", `Found ${relevantChunks.length} relevant chunks`);
      const context = relevantChunks.map((c) => c.content).join("\n\n");
      const sources = [...new Set(relevantChunks.map((c) => c.sourceFile))];

      const messages: ChatMessage[] = [
        {
          role: "system",
          content:
            systemPrompt ||
            `You are a helpful AI assistant for Full Solution. Use the provided context to answer questions accurately. If the answer isn't in the context, say you don't have that information.

Context:
${context}`,
        },
        ...recentMessages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        { role: "user" as const, content: userMessage },
      ];

      logger.debug("chat-service", "Calling LLM with context", {
        contextLength: context.length,
        messageCount: messages.length,
      });

      const response = await this.callLLM(messages as unknown as ChatMessage[]);
      logger.info("chat-service", `LLM responded in ${Date.now() - startTime}ms`);

      await retrievalService.storeMessage(sessionId, "user", userMessage);
      await retrievalService.storeMessage(sessionId, "assistant", response);

      const result: ChatResponse = {
        message: response,
        sources,
        cached: false,
      };

      await cacheService.setJSON(cacheKey, result, 1800);
      logger.info("chat-service", `Total response time: ${Date.now() - startTime}ms`);
      return result;
    } catch (error) {
      logger.error("chat-service", "Chat generation error:", error);
      return {
        message:
          "I apologize, but I'm having trouble processing your request right now. Please try again later.",
        sources: [],
        cached: false,
      };
    }
  }

  private async callLLM(messages: ChatMessage[]): Promise<string> {
    const prompt = this.formatMessagesForLLM(messages);
    logger.debug("chat-service", `Calling Hugging Face API: ${HF_MODEL.slice(0, 50)}...`);

    const response = await fetch(`${HF_MODEL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 512,
          temperature: 0.7,
          top_p: 0.95,
          return_full_text: false,
        },
      }),
    });

    if (!response.ok) {
      logger.error("chat-service", `LLM API error: ${response.statusText}`);
      throw new Error(`LLM API error: ${response.statusText}`);
    }

    const result = await response.json();
    return this.extractResponse(result);
  }

  private formatMessagesForLLM(messages: ChatMessage[]): string {
    return messages
      .map((m) => {
        if (m.role === "system") return `[INST] ${m.content} [/INST]`;
        if (m.role === "user") return `[INST] ${m.content} [/INST]`;
        return m.content;
      })
      .join("\n");
  }

  private extractResponse(
    result: Record<string, unknown> | Array<Record<string, unknown>>,
  ): string {
    if (Array.isArray(result) && result[0]?.generated_text) {
      return String(result[0].generated_text).trim();
    }
    if ((result as Record<string, unknown>).generated_text) {
      return String((result as Record<string, unknown>).generated_text).trim();
    }
    return String(result).trim();
  }
}

export const chatService = new ChatService();
