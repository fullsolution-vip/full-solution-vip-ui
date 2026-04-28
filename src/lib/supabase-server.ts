import { createClient } from "@supabase/supabase-js";

export function createSupabaseServerClient(_request?: Request) {
  const supabaseUrl = process.env.SUPABASE_URL || "https://your-project.supabase.co";
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "your-service-key";

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}