import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function ChatInterface() {
  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch("/api/chat", { method: "POST" })
      .then((res) => res.json())
      .then(({ sessionId }) => setSessionId(sessionId))
      .catch(console.error);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Auto-focus the input when component mounts
    if (textareaRef.current && !loading) {
      textareaRef.current.focus();
    }
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, sessionId }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.message || "Sorry, I couldn't process that.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, there was an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      // Re-focus the input after response
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-300px)] min-h-[500px] max-h-[700px] w-full">
      <div className="p-3 border-b flex items-center gap-2 shrink-0">
        <Bot className="size-5 text-primary" />
        <h3 className="font-serif text-lg">Full Solution Assistant</h3>
      </div>

      <ScrollArea className="flex-1 px-3 py-2">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-4 text-sm">
            Ask me anything about Full Solution products, ingredients, shipping, or returns.
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn("mb-3 flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}
          >
            {msg.role === "assistant" && (
              <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="size-3.5 text-primary" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-lg p-2.5 text-sm",
                msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
              )}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="size-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                <User className="size-3.5 text-primary-foreground" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-2 mb-3">
            <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="size-3.5 text-primary" />
            </div>
            <div className="bg-muted rounded-lg p-2.5 flex items-center">
              <Loader2 className="size-3.5 animate-spin" />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2 shrink-0">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 min-h-[40px] max-h-[80px] text-sm py-2"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <Button type="submit" size="icon" disabled={loading || !input.trim()} className="h-10 w-10 shrink-0">
          <Send className="size-4" />
        </Button>
      </form>
    </Card>
  );
}
