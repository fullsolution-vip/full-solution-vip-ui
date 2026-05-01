import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Loader2, Database, Users, RefreshCw, Trash2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSupabase } from "@/lib/supabase";
import { getSession } from "@/lib/auth";
import { setUserRole } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const session = await getSession();
    if (!session.isAuthenticated || session.user?.role !== "admin") {
      throw new Error("Unauthorized - Admin access required");
    }
  },
  component: AdminPage,
});

interface UserProfile {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

function AdminPage() {
  const [knowledgeStatus, setKnowledgeStatus] = useState<{
    count: number;
    loading: boolean;
  }>({ count: 0, loading: true });
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [reindexing, setReindexing] = useState(false);

  useEffect(() => {
    loadKnowledgeStatus();
    loadUsers();
  }, []);

  const loadKnowledgeStatus = async () => {
    try {
      const supabase = getSupabase();
      const { count, error } = await supabase
        .from("chatbot_knowledge_base")
        .select("*", { count: "exact", head: true });

      if (!error) {
        setKnowledgeStatus({ count: count || 0, loading: false });
      }
    } catch (err) {
      console.error("Failed to load knowledge status:", err);
      setKnowledgeStatus((prev) => ({ ...prev, loading: false }));
    }
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase.auth.admin.listUsers();

      if (!error && data.users) {
        setUsers(
          data.users.map((u) => ({
            id: u.id,
            email: u.email || "",
            role: (u.user_metadata?.role as string) || "client",
            created_at: u.created_at,
          }))
        );
      }
    } catch (err) {
      console.error("Failed to load users:", err);
      // Try with service role via API
      try {
        const res = await fetch("/api/admin/users");
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users || []);
        }
      } catch (e) {
        console.error("API fallback failed:", e);
      }
    } finally {
      setUsersLoading(false);
    }
  };

  const handleReindex = async () => {
    setReindexing(true);
    try {
      const res = await fetch("/api/chatbot-init?force=true", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert(`Re-index complete! ${data.message}`);
        loadKnowledgeStatus();
      } else {
        alert(`Re-index failed: ${data.message}`);
      }
    } catch (err) {
      alert(`Re-index failed: ${err}`);
    } finally {
      setReindexing(false);
    }
  };

  const toggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "client" : "admin";
    try {
      await setUserRole({ userId, role: newRole as "admin" | "client" });
      loadUsers();
    } catch (err) {
      alert(`Failed to update role: ${err}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container-page py-8">
        <h1 className="font-serif text-3xl mb-6">Admin Panel</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Knowledge Base */}
          <section className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Knowledge Base</h2>
            <p className="text-muted-foreground mb-4">
              Chatbot knowledge from <code>SPEC/knowledge-base/</code>
            </p>

            <div className="flex items-center gap-2 mb-4">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {knowledgeStatus.loading ? (
                  <Loader2 className="h-3 w-3 inline animate-spin" />
                ) : (
                  `${knowledgeStatus.count} chunks indexed`
                )}
              </span>
            </div>

            <Button
              onClick={handleReindex}
              disabled={reindexing}
              className="w-full"
            >
              {reindexing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Re-indexing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Force Re-index
                </>
              )}
            </Button>
          </section>

          {/* User Management */}
          <section className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Users</h2>
            <p className="text-muted-foreground mb-4">
              Manage user roles and permissions.
            </p>

            {usersLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-sm text-muted-foreground">No users found.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 rounded border"
                  >
                    <div>
                      <p className="text-sm font-medium">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant={user.role === "admin" ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleUserRole(user.id, user.role)}
                    >
                      <ShieldCheck className="mr-1 h-3 w-3" />
                      {user.role}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* API Docs */}
          <section className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">API Documentation</h2>
            <p className="text-muted-foreground mb-4">
              View Swagger API docs for product management.
            </p>
            <Button asChild className="w-full">
              <a href="/api-docs" target="_blank">
                Open API Docs
              </a>
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}
