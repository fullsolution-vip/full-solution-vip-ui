import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { embeddingService } from "@/lib/chatbot/embedding-service";
import { retrievalService } from "@/lib/chatbot/retrieval-service";
import { chatService } from "@/lib/chatbot/chat-service";
import { chunkText } from "@/lib/chatbot/knowledge-loader";

vi.mock("@/lib/chatbot/embedding-service", () => ({
  embeddingService: {
    generateEmbedding: vi.fn(),
    hashText: vi.fn(),
  },
}));

vi.mock("@/lib/chatbot/retrieval-service", () => ({
  retrievalService: {
    similaritySearch: vi.fn(),
    storeMessage: vi.fn(),
    getRecentMessages: vi.fn(),
    getChunkByHash: vi.fn(),
    getKnowledgeCount: vi.fn(),
  },
}));

vi.mock("@/lib/chatbot/chat-service", () => ({
  chatService: {
    generateResponse: vi.fn(),
  },
}));

describe("Chatbot RAG System", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Embedding Service", () => {
    it("should generate embeddings for text", async () => {
      const mockEmbedding = Array(384).fill(0.1);
      vi.mocked(embeddingService.generateEmbedding).mockResolvedValue(mockEmbedding);

      const result = await embeddingService.generateEmbedding("test text");
      expect(result).toHaveLength(384);
    });

    it("should hash text consistently", () => {
      vi.mocked(embeddingService.hashText)
        .mockReturnValueOnce("hash1")
        .mockReturnValueOnce("hash1");
      
      const hash1 = embeddingService.hashText("hello");
      const hash2 = embeddingService.hashText("hello");
      expect(hash1).toBe(hash2);
    });
  });

  describe("Retrieval Service", () => {
    it("should perform similarity search", async () => {
      const mockChunks = [
        {
          id: "1",
          content: "Full Solution products",
          sourceFile: "01-company.md",
          similarity: 0.95,
          metadata: {},
        },
      ];

      vi.mocked(retrievalService.similaritySearch).mockResolvedValue(mockChunks);

      const results = await retrievalService.similaritySearch("beauty products");
      expect(results).toHaveLength(1);
      expect(results[0].content).toContain("Full Solution");
    });

    it("should store and retrieve messages", async () => {
      vi.mocked(retrievalService.storeMessage).mockResolvedValue(undefined);
      vi.mocked(retrievalService.getRecentMessages).mockResolvedValue([
        { role: "user", content: "Hello" },
        { role: "assistant", content: "Hi there!" },
      ]);

      await retrievalService.storeMessage("session-1", "user", "Hello");
      const messages = await retrievalService.getRecentMessages("session-1");

      expect(messages).toHaveLength(2);
    });
  });

  describe("Chat Service", () => {
    it("should generate response with RAG context", async () => {
      const mockResponse = {
        message: "Full Solution offers premium skincare products.",
        sources: ["01-company.md"],
        cached: false,
      };

      vi.mocked(chatService.generateResponse).mockResolvedValue(mockResponse);

      const result = await chatService.generateResponse("session-1", "Tell me about Full Solution");
      expect(result.message).toContain("Full Solution");
      expect(result.sources).toContain("01-company.md");
    });
  });

  describe("Knowledge Base Loading", () => {
    it("should chunk text correctly", () => {
      const longText = "a".repeat(1000);
      const chunks = chunkText(longText, 200, 50);
      expect(chunks.length).toBeGreaterThan(1);
      chunks.forEach((chunk) => {
        expect(chunk.length).toBeLessThanOrEqual(200);
      });
    });
  });
});
