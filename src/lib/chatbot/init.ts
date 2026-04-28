import { initializeKnowledgeBase } from "./knowledge-loader";

export async function initializeChatbot() {
  try {
    console.log("Initializing chatbot...");
    await initializeKnowledgeBase();
    console.log("Chatbot initialized successfully");
  } catch (error) {
    console.error("Failed to initialize chatbot:", error);
  }
}
