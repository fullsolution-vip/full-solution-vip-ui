import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { embeddingService } from "./embedding-service";
import { cacheService } from "./cache-service";
import { logger } from "@/lib/logger";

export interface KnowledgeChunk {
  id: string;
  content: string;
  sourceFile: string;
  similarity: number;
  metadata: Record<string, unknown>;
}

export class RetrievalService {
  private supabase: SupabaseClient | null = null;

  private getSupabaseClient(): SupabaseClient {
    if (this.supabase) return this.supabase;

    const supabaseUrl = process.env.SUPABASE_URL || "";
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || "";
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase URL and service key are required");
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    return this.supabase;
  }

  async similaritySearch(
    query: string,
    matchThreshold = 0.7,
    matchCount = 5,
  ): Promise<KnowledgeChunk[]> {
    try {
      const embedding = await embeddingService.generateEmbedding(query);
      const supabase = this.getSupabaseClient();

      const { data, error } = await supabase.rpc("match_knowledge", {
        query_embedding: embedding,
        match_threshold: matchThreshold,
        match_count: matchCount,
      });

      if (error) {
        logger.error("retrieval-service", "Similarity search error:", error);
        return [];
      }

      return (data || []).map((row: Record<string, unknown>) => ({
        id: String(row.id),
        content: String(row.content),
        sourceFile: String(row.source_file),
        similarity: Number(row.similarity),
        metadata: (row.metadata as Record<string, unknown>) || {},
      }));
    } catch (error) {
      logger.error("retrieval-service", "Retrieval error:", error);
      return [];
    }
  }

  async storeChunk(
    content: string,
    embedding: number[],
    sourceFile: string,
    chunkIndex: number,
    metadata: Record<string, unknown> = {},
  ): Promise<void> {
    const contentHash = embeddingService.hashText(content);
    const supabase = this.getSupabaseClient();

    const { error } = await supabase.from("chatbot_knowledge_base").upsert(
      {
        content,
        content_hash: contentHash,
        embedding,
        source_file: sourceFile,
        chunk_index: chunkIndex,
        metadata,
      },
      { onConflict: "content_hash" },
    );

    if (error) {
      logger.error("retrieval-service", "Failed to store chunk:", error);
      throw new Error("Failed to store knowledge chunk");
    }
  }

  async getSampleRows(limit = 5): Promise<Array<Record<string, unknown>>> {
    const supabase = this.getSupabaseClient();
    const { data, error } = await supabase
      .from("chatbot_knowledge_base")
      .select("id, source_file, chunk_index, content, created_at")
      .limit(limit);

    if (error) {
      logger.error("retrieval-service", "Failed to get sample rows", error);
      return [];
    }

    return data || [];
  }

  async getChunkByHash(hash: string): Promise<boolean> {
    const supabase = this.getSupabaseClient();
    const { data, error } = await supabase
      .from("chatbot_knowledge_base")
      .select("id")
      .eq("content_hash", hash)
      .single();

    return !error && !!data;
  }

  async getKnowledgeCount(): Promise<number> {
    const supabase = this.getSupabaseClient();
    const { count, error } = await supabase
      .from("chatbot_knowledge_base")
      .select("*", { count: "exact", head: true });

    if (error) return 0;
    return count || 0;
  }

  async getRecentMessages(
    sessionId: string,
    limit = 10,
  ): Promise<Array<{ role: string; content: string }>> {
    const cacheKey = cacheService.generateKey("messages", sessionId);
    const cached = await cacheService.getJSON<Array<{ role: string; content: string }>>(cacheKey);
    if (cached) return cached;

    const supabase = this.getSupabaseClient();
    const { data, error } = await supabase
      .from("chatbot_messages")
      .select("role, content")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    const messages = data.reverse().map((msg) => ({
      role: String(msg.role),
      content: String(msg.content),
    }));

    await cacheService.setJSON(cacheKey, messages, 300);
    return messages;
  }

  async storeMessage(
    sessionId: string,
    role: "user" | "assistant" | "system",
    content: string,
    metadata: Record<string, unknown> = {},
  ): Promise<void> {
    const supabase = this.getSupabaseClient();
    const { error } = await supabase.from("chatbot_messages").insert({
      session_id: sessionId,
      role,
      content,
      metadata,
    });

    if (error) {
      logger.error("retrieval-service", "Failed to store message:", error);
    }

    const cacheKey = cacheService.generateKey("messages", sessionId);
    await cacheService.get(cacheKey).then(() => cacheService.set(cacheKey, "", 1));
  }
}

export const retrievalService = new RetrievalService();
