import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { retrievalService } from "@/lib/chatbot/retrieval-service";
import { chatService } from "@/lib/chatbot/chat-service";

vi.mock("@/lib/chatbot/retrieval-service", () => ({
  retrievalService: {
    similaritySearch: vi.fn(),
    storeMessage: vi.fn().mockResolvedValue(undefined),
    getRecentMessages: vi.fn().mockResolvedValue([]),
    getChunkByHash: vi.fn(),
    getKnowledgeCount: vi.fn(),
  },
}));

vi.mock("@/lib/chatbot/chat-service", () => ({
  chatService: {
    generateResponse: vi.fn(),
  },
}));

describe("Supabase Database Operations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should store and retrieve chat messages", async () => {
    const sessionId = "test-session-123";
    const testMessage = "Hello, chatbot!";

    // Simulate storing a message
    await retrievalService.storeMessage(sessionId, "user", testMessage);
    expect(retrievalService.storeMessage).toHaveBeenCalledWith(
      sessionId,
      "user",
      testMessage
    );

    // Simulate retrieving messages
    const mockMessages = [
      { role: "user", content: testMessage },
      { role: "assistant", content: "Hi there!" },
    ];
    vi.mocked(retrievalService.getRecentMessages).mockResolvedValue(mockMessages);

    const messages = await retrievalService.getRecentMessages(sessionId);
    expect(messages).toHaveLength(2);
    expect(messages[0].role).toBe("user");
    expect(messages[1].role).toBe("assistant");
  });

  it("should perform similarity search on knowledge base", async () => {
    const mockChunks = [
      {
        id: "1",
        content: "Full Solution offers premium skincare",
        sourceFile: "01-company.md",
        similarity: 0.95,
        metadata: {},
      },
    ];

    vi.mocked(retrievalService.similaritySearch).mockResolvedValue(mockChunks);

    const results = await retrievalService.similaritySearch("skincare products");
    expect(results).toHaveLength(1);
    expect(results[0].content).toContain("Full Solution");
  });

  it("should generate chat response with RAG context", async () => {
    const mockResponse = {
      message: "Full Solution offers premium skincare products.",
      sources: ["01-company.md"],
      cached: false,
    };

    vi.mocked(chatService.generateResponse).mockResolvedValue(mockResponse);
    vi.mocked(retrievalService.similaritySearch).mockResolvedValue([
      {
        id: "1",
        content: "Full Solution skincare info",
        sourceFile: "01-company.md",
        similarity: 0.9,
        metadata: {},
      },
    ]);

    const response = await chatService.generateResponse(
      "session-1",
      "Tell me about Full Solution"
    );

    expect(response.message).toContain("Full Solution");
    expect(response.sources).toContain("01-company.md");
  });

  it("should check knowledge base count", async () => {
    vi.mocked(retrievalService.getKnowledgeCount).mockResolvedValue(57); // 7 files * ~8 chunks each

    const count = await retrievalService.getKnowledgeCount();
    expect(count).toBeGreaterThan(0);
    expect(count).toBe(57);
  });
});
