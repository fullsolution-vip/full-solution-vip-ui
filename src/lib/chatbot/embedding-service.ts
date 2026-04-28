import crypto from "crypto";

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY || "";
const EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2";

export interface EmbeddingResult {
  embedding: number[];
  cached: boolean;
}

export class EmbeddingService {
  private cache: Map<string, number[]> = new Map();

  async generateEmbedding(text: string): Promise<number[]> {
    const hash = this.hashText(text);
    
    if (this.cache.has(hash)) {
      return this.cache.get(hash)!;
    }

    try {
      const response = await fetch(
        `https://api-inference.huggingface.co/pipeline/feature-extraction/${EMBEDDING_MODEL}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${HF_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: text }),
        }
      );

      if (!response.ok) {
        throw new Error(`Embedding API error: ${response.statusText}`);
      }

      const result = await response.json();
      const embedding = Array.isArray(result) ? result[0] : result;
      
      this.cache.set(hash, embedding);
      return embedding;
    } catch (error) {
      console.error("Failed to generate embedding:", error);
      throw new Error("Failed to generate embedding");
    }
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const results = await Promise.all(
      texts.map(text => this.generateEmbedding(text))
    );
    return results;
  }

  hashText(text: string): string {
    return crypto.createHash("sha256").update(text).digest("hex");
  }

  clearCache() {
    this.cache.clear();
  }
}

export const embeddingService = new EmbeddingService();
