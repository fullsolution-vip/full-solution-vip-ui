import { createClient, SupabaseClient } from "@supabase/supabase-js";

export function getSupabaseServerClient(request?: Request) {
  const supabaseUrl = process.env.SUPABASE_URL || "https://your-project.supabase.co";
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "your-anon-key";

  const cookieHeader = request?.headers.get("cookie") || "";

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: cookieHeader ? { cookie: cookieHeader } : {},
    },
  });
}

// Service role client for admin operations (bypasses RLS)
let serviceClient: SupabaseClient | null = null;

export function getSupabaseServiceClient() {
  if (serviceClient) return serviceClient;

  const supabaseUrl = process.env.SUPABASE_URL || "https://your-project.supabase.co";
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "your-service-key";

  serviceClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return serviceClient;
}
