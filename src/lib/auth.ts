import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient, getSupabaseServiceClient } from "@/lib/supabase-server";

export interface AuthUser {
  id: string;
  email: string;
  role: "admin" | "client" | "guest";
}

export interface AuthSession {
  user: AuthUser | null;
  isAuthenticated: boolean;
}

export const getSession = createServerFn({ method: "GET" }).handler(async ({ request }) => {
  const supabase = getSupabaseServerClient(request);
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return { user: null, isAuthenticated: false };
  }

  // Fetch user role from profiles table or use metadata
  const role = (data.user.user_metadata?.role as "admin" | "client") || "client";

  return {
    user: {
      id: data.user.id,
      email: data.user.email || "",
      role,
    },
    isAuthenticated: true,
  };
});

export const signOut = createServerFn({ method: "POST" }).handler(async ({ request }) => {
  const supabase = getSupabaseServerClient(request);
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
});

// Admin-only: set user role (requires service role key)
export const setUserRole = createServerFn({ method: "POST" })
  .handler(async (ctx) => {
    const input = ctx.data as { userId: string; role: "admin" | "client" };
    if (!input?.userId || !input?.role) {
      throw new Error("Invalid input: userId and role required");
    }
    const { userId, role } = input;
    const supabase = getSupabaseServiceClient();
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { role },
    });

    if (error) throw new Error(error.message);
    return { success: true };
  });
