import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getSupabase } from "@/lib/supabase";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          console.error("Auth callback error:", error);
          navigate({ to: "/login?error=auth_failed" });
          return;
        }

        // Successfully authenticated, redirect to account page
        navigate({ to: "/account" });
      } catch (err) {
        console.error("Auth callback exception:", err);
        navigate({ to: "/login?error=auth_failed" });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}
