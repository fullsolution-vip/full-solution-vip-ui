import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Client-side singleton
let clientSideClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (clientSideClient) return clientSideClient;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co";
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key";

  clientSideClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return clientSideClient;
}

// Hook to use Supabase auth state
import { useState, useEffect } from "react";

export function useAuth() {
  const [session, setSession] = useState<{
    user: { id: string; email: string } | null;
    loading: boolean;
  }>({ user: null, loading: true });

  useEffect(() => {
    const supabase = getSupabase();

    supabase.auth.getSession().then(({ data }) => {
      setSession({
        user: data.session?.user
          ? { id: data.session.user.id, email: data.session.user.email || "" }
          : null,
        loading: false,
      });
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession({
        user: session?.user
          ? { id: session.user.id, email: session.user.email || "" }
          : null,
        loading: false,
      });
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return session;
}
