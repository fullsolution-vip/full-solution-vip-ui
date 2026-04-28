import fs from "fs";
import path from "path";
import { embeddingService } from "./embedding-service";
import { retrievalService } from "./retrieval-service";

const KNOWLEDGE_BASE_PATH = path.join(process.cwd(), "SPEC/knowledge-base");

export interface KnowledgeFile {
  path: string;
  content: string;
  filename: string;
}

export function loadKnowledgeFiles(): KnowledgeFile[] {
  if (!fs.existsSync(KNOWLEDGE_BASE_PATH)) {
    console.warn(`Knowledge base path not found: ${KNOWLEDGE_BASE_PATH}`);
    return [];
  }

  const files = fs
    .readdirSync(KNOWLEDGE_BASE_PATH)
    .filter((f) => f.endsWith(".md"))
    .filter((f) => !f.startsWith("_"));

  return files.map((filename) => {
    const filePath = path.join(KNOWLEDGE_BASE_PATH, filename);
    const content = fs.readFileSync(filePath, "utf-8");
    return { path: filePath, content, filename };
  });
}

export function chunkText(
  text: string,
  maxChunkSize = 500,
  overlap = 50
): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + maxChunkSize, text.length);
    chunks.push(text.slice(start, end));
    start += maxChunkSize - overlap;
  }

  return chunks.filter((c) => c.trim().length > 0);
}

export async function processKnowledgeBase(): Promise<void> {
  try {
    const files = loadKnowledgeFiles();
    console.log(`Loading ${files.length} knowledge base files...`);

    for (const file of files) {
      const chunks = chunkText(file.content);
      console.log(`Processing ${file.filename}: ${chunks.length} chunks`);

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const hash = embeddingService.hashText(chunk);

        try {
          const existing = await retrievalService.getChunkByHash(hash);
          if (existing) {
            console.log(`Chunk ${i} from ${file.filename} already exists, skipping`);
            continue;
          }

          const embedding = await embeddingService.generateEmbedding(chunk);
          await retrievalService.storeChunk(chunk, embedding, file.filename, i, {
            source: file.filename,
            chunkIndex: i,
          });

          console.log(`Stored chunk ${i} from ${file.filename}`);
        } catch (error) {
          console.error(`Failed to process chunk ${i} from ${file.filename}:`, error);
        }
      }
    }

    console.log("Knowledge base processing complete");
  } catch (error) {
    console.error("Failed to process knowledge base:", error);
  }
}

export async function initializeKnowledgeBase(): Promise<void> {
  const knowledgeCount = await retrievalService.getKnowledgeCount();
  
  if (knowledgeCount === 0) {
    console.log("Initializing knowledge base...");
    await processKnowledgeBase();
  } else {
    console.log(`Knowledge base already initialized (${knowledgeCount} chunks)`);
  }
}
