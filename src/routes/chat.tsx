import { createFileRoute } from "@tanstack/react-router";
import { ChatInterface } from "@/components/chatbot/chat-interface";
import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat with Full Solution Assistant" },
      {
        name: "description",
        content:
          "Get instant answers about Full Solution products, ingredients, shipping, and more.",
      },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-page py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl">Chat with Full Solution Assistant</h1>
            <p className="mt-3 text-muted-foreground">
              Ask questions about our products, ingredients, shipping, returns, or anything else.
            </p>
          </div>

          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
