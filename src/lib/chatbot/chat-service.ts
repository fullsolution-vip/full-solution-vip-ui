import { retrievalService } from "./retrieval-service";
import { cacheService } from "./cache-service";
import { logger } from "@/lib/logger";
import { emailService } from "@/lib/email";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_MODEL = process.env.GROQ_MODEL || "groq/compound-mini";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "frederick1989@gmail.com";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatResponse {
  message: string;
  sources: string[];
  cached: boolean;
  escalated?: boolean;
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

      // Escalate to admin via email
      await this.escalateToAdmin(sessionId, userMessage, error);

      return {
        message:
          "I apologize, but I'm having trouble processing your request right now. I've notified our team and someone will assist you shortly.",
        sources: [],
        cached: false,
        escalated: true,
      };
    }
  }

  private async escalateToAdmin(sessionId: string, userMessage: string, error: unknown) {
    try {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const subject = `Chat Escalation - Session ${sessionId.slice(0, 8)}`;
      const html = `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a; font-family: 'Playfair Display', serif;">Chat Bot Escalation</h1>
          <div style="background: #f5f5f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Session ID:</strong> ${sessionId}</p>
            <p><strong>User Message:</strong></p>
            <p style="background: white; padding: 10px; border-radius: 4px;">${userMessage}</p>
            <p><strong>Error:</strong></p>
            <p style="color: #dc2626;">${errorMessage}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg" })}</p>
          </div>
          <p style="color: #666; font-size: 14px;">
            You can join the chat with the client from your phone. Reply to this email to continue the conversation.
          </p>
        </div>
      `;

      await emailService.send({
        to: ADMIN_EMAIL,
        subject,
        html,
        replyTo: ADMIN_EMAIL,
      });

      logger.info("chat-service", "Escalation email sent to admin");
    } catch (emailError) {
      logger.error("chat-service", "Failed to send escalation email:", emailError);
    }
  }

  private async callLLM(messages: ChatMessage[]): Promise<string> {
    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY not configured");
    }

    logger.debug("chat-service", `Calling Groq API with model: ${GROQ_MODEL}`);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        max_tokens: 512,
        temperature: 0.7,
        top_p: 0.95,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error("chat-service", `Groq API error: ${response.statusText}`, { errorText });
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const result = await response.json();
    return result.choices[0]?.message?.content || "No response generated";
  }
}

export const chatService = new ChatService();
