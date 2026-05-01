import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Loader2, MessageSquare, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSupabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

export const Route = createFileRoute("/portal")({
  beforeLoad: async () => {
    const session = await getSession();
    if (!session.isAuthenticated) {
      throw new Error("Unauthorized");
    }
  },
  component: PortalPage,
});

interface ChatSession {
  session_id: string;
  created_at: string;
  updated_at: string;
  message_count?: number;
}

interface ChatMessage {
  id: string;
  role: string;
  content: string;
  created_at: string;
}

function PortalPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const supabase = getSupabase();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from("chatbot_sessions")
        .select("session_id, created_at, updated_at")
        .eq("user_id", userData.user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;

      // Get message counts for each session
      const sessionsWithCounts = await Promise.all(
        (data || []).map(async (session) => {
          const { count } = await supabase
            .from("chatbot_messages")
            .select("*", { count: "exact", head: true })
            .eq("session_id", session.session_id);
          return { ...session, message_count: count || 0 };
        })
      );

      setSessions(sessionsWithCounts);
      if (sessionsWithCounts.length > 0 && !selectedSession) {
        setSelectedSession(sessionsWithCounts[0].session_id);
      }
    } catch (err) {
      console.error("Failed to load sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (sessionId: string) => {
    setMessagesLoading(true);
    setSelectedSession(sessionId);
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("chatbot_messages")
        .select("id, role, content, created_at")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setMessagesLoading(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from("chatbot_sessions")
        .delete()
        .eq("session_id", sessionId);

      if (error) throw error;

      await loadSessions();
      if (selectedSession === sessionId) {
        setSelectedSession(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to delete session:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container-page py-8">
        <h1 className="font-serif text-3xl mb-6">Customer Portal</h1>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chat Sessions Sidebar */}
          <section className="rounded-lg border p-6 lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Chat History</h2>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : sessions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No chat history yet. Start chatting with our assistant!
              </p>
            ) : (
              <div className="space-y-2">
                {sessions.map((session) => (
                  <div
                    key={session.session_id}
                    className={`p-3 rounded-md border cursor-pointer transition-colors ${
                      selectedSession === session.session_id
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-secondary"
                    }`}
                    onClick={() => loadMessages(session.session_id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Session {session.session_id.slice(0, 8)}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session.session_id);
                        }}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(session.updated_at).toLocaleDateString()} (
                      {session.message_count} messages)
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Chat Messages */}
          <section className="rounded-lg border p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">
              {selectedSession
                ? `Session ${selectedSession.slice(0, 8)}`
                : "Select a chat session"}
            </h2>

            {!selectedSession ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Select a chat session to view messages</p>
              </div>
            ) : messagesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-primary/10 ml-8"
                        : "bg-secondary mr-8"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        {msg.role === "user" ? "You" : "AI Assistant"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
