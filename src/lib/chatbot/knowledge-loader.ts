import fs from "fs";
import path from "path";
import { embeddingService } from "./embedding-service";
import { retrievalService } from "./retrieval-service";
import { logger } from "@/lib/logger";

const KNOWLEDGE_BASE_PATH = path.join(process.cwd(), "SPEC/knowledge-base");

export interface KnowledgeFile {
  path: string;
  content: string;
  filename: string;
}

export function loadKnowledgeFiles(): KnowledgeFile[] {
  if (!fs.existsSync(KNOWLEDGE_BASE_PATH)) {
    logger.warn("knowledge-loader", `Knowledge base path not found: ${KNOWLEDGE_BASE_PATH}`);
    return [];
  }

  const files = fs
    .readdirSync(KNOWLEDGE_BASE_PATH)
    .filter((f) => f.endsWith(".md"))
    .filter((f) => !f.startsWith("_"));

  logger.info("knowledge-loader", `Found ${files.length} knowledge base files`);
  
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
    logger.info("knowledge-loader", `Loading ${files.length} knowledge base files...`);

    for (const file of files) {
      const fileHash = embeddingService.hashText(file.content);
      const chunks = chunkText(file.content);
      logger.info("knowledge-loader", `Processing ${file.filename}: ${chunks.length} chunks (file hash: ${fileHash.slice(0, 8)}...)`);

      let newChunks = 0;
      let skippedChunks = 0;

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const hash = embeddingService.hashText(chunk);

        try {
          const existing = await retrievalService.getChunkByHash(hash);
          if (existing) {
            skippedChunks++;
            continue;
          }

          logger.debug("knowledge-loader", `Generating embedding for chunk ${i} of ${file.filename}`);
          const embedding = await embeddingService.generateEmbedding(chunk);
          await retrievalService.storeChunk(chunk, embedding, file.filename, i, {
            source: file.filename,
            chunkIndex: i,
            fileHash,
          });

          newChunks++;
          logger.info("knowledge-loader", `Stored chunk ${i} from ${file.filename}`);
        } catch (error) {
          logger.error("knowledge-loader", `Failed to process chunk ${i} from ${file.filename}:`, error);
        }
      }

      logger.info("knowledge-loader", `File ${file.filename} complete: ${newChunks} new chunks, ${skippedChunks} unchanged`);
    }

    logger.info("knowledge-loader", "Knowledge base processing complete");
  } catch (error) {
    logger.error("knowledge-loader", "Failed to process knowledge base:", error);
  }
}

export async function initializeKnowledgeBase(): Promise<void> {
  logger.info("knowledge-loader", "Checking knowledge base status...");
  const knowledgeCount = await retrievalService.getKnowledgeCount();
  
  if (knowledgeCount === 0) {
    logger.info("knowledge-loader", "Initializing knowledge base from scratch...");
    await processKnowledgeBase();
  } else {
    logger.info("knowledge-loader", `Knowledge base already has ${knowledgeCount} chunks, checking for updates...`);
    await processKnowledgeBase();
  }
}
