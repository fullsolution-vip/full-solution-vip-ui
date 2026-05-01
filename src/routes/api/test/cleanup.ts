import { createFileRoute } from "@tanstack/react-router";
import { getSupabaseServiceClient } from "@/lib/supabase-server";
import { emailService } from "@/lib/email";

export const Route = createFileRoute("/api/test/cleanup")({
  server: {
    handlers: {
      // GET: List test users and data
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const action = url.searchParams.get("action") || "list";

        if (action === "list") {
          const testUsers = await getTestUsers();
          return new Response(JSON.stringify({ users: testUsers }), {
            headers: { "Content-Type": "application/json" },
          });
        }

        if (action === "clean") {
          const result = await cleanTestData();
          return new Response(JSON.stringify(result), {
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      },

      // DELETE: Remove test data
      DELETE: async () => {
        const result = await cleanTestData();
        return new Response(JSON.stringify(result), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});

async function getTestUsers() {
  const supabase = getSupabaseServiceClient();
  const testPatterns = [
    "test-",
    "cosmetic-test-",
    "qa-",
    "playwright-",
    "e2e-",
  ];

  const allUsers: Array<{
    id: string;
    email: string;
    created_at: string;
    is_test: boolean;
  }> = [];

  const { data, error } = await supabase.auth.admin.listUsers();

  if (error || !data?.users) return [];

  for (const user of data.users) {
    const isTest = testPatterns.some(
      (pattern) =>
        (user.email && user.email.includes(pattern)) ||
        (user.email && user.email.includes("fullsolution-test.com")) ||
        (user.email && user.email.includes("example.com"))
    );

    if (isTest) {
      allUsers.push({
        id: user.id,
        email: user.email || "",
        created_at: user.created_at,
        is_test: true,
      });
    }
  }

  return allUsers;
}

async function cleanTestData() {
  const supabase = getSupabaseServiceClient();
  const testUsers = await getTestUsers();

  let deletedUsers = 0;
  let deletedSessions = 0;
  let deletedMessages = 0;

  for (const user of testUsers) {
    // Delete chat sessions and messages for this user
    const { data: sessions } = await supabase
      .from("chatbot_sessions")
      .select("session_id")
      .eq("user_id", user.id);

    if (sessions && sessions.length > 0) {
      const sessionIds = sessions.map((s) => s.session_id);

      const { count: msgCount } = await supabase
        .from("chatbot_messages")
        .delete({ count: "exact" })
        .in("session_id", sessionIds);

      deletedMessages += msgCount || 0;

      const { count: sessCount } = await supabase
        .from("chatbot_sessions")
        .delete({ count: "exact" })
        .eq("user_id", user.id);

      deletedSessions += sessCount || 0;
    }

    // Delete the user from Supabase Auth
    const { error } = await supabase.auth.admin.deleteUser(user.id);
    if (!error) deletedUsers++;
  }

  return {
    success: true,
    deleted: {
      users: deletedUsers,
      sessions: deletedSessions,
      messages: deletedMessages,
    },
    message: `Cleaned ${deletedUsers} test users and their data`,
  };
}
