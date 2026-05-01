import { Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, User, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getSession, signOut } from "@/lib/auth";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/science", label: "Science" },
  { to: "/about", label: "About" },
  { to: "/wholesale", label: "Wholesale" },
  { to: "/contact", label: "Contact" },
  { to: "/chat", label: "Chat" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  
  // For now, we'll use a simple client-side auth check
  // In production, this would come from a server function or context
  const [user, setUser] = useState<null | { email: string; role: string }>(null);
  const [loading, setLoading] = useState(true);

  // Check auth state on mount
  useState(() => {
    getSession().then((session) => {
      if (session.isAuthenticated && session.user) {
        setUser({ email: session.user.email, role: session.user.role || "client" });
      }
      setLoading(false);
    });
  });

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    router.navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/75 border-b border-border/60">
      <div className="container-page flex h-16 md:h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="inline-block h-2 w-2 rounded-full bg-gold transition-transform group-hover:scale-150" />
          <span className="font-serif text-xl md:text-2xl tracking-tight">
            Full <span className="italic text-gold-gradient">Solution</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              preload={true}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground font-medium" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="text-sm font-medium">{user.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/portal" className="flex items-center gap-2 w-full">
                    <LayoutDashboard className="h-4 w-4" />
                    Customer Portal
                  </Link>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center gap-2 w-full">
                      <Settings className="h-4 w-4" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-sm rounded-full bg-primary text-primary-foreground px-5 py-2.5 hover:opacity-90 transition-opacity"
              >
                Sign Up
              </Link>
            </div>
          )}

          <button
            className="md:hidden p-2 -mr-2"
            onClick={() => setOpen((s) => !s)}
            aria-label="Toggle menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-[max-height] duration-300 border-t border-border/60",
          open ? "max-h-96" : "max-h-0",
        )}
      >
        <nav className="container-page py-4 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              preload={true}
              className="py-3 text-sm text-muted-foreground"
              activeProps={{ className: "text-foreground font-medium" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          {!user && (
            <div className="pt-4 flex gap-3 border-t border-border/60">
              <Link
                to="/login"
                className="text-sm"
                onClick={() => setOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-sm rounded-full bg-primary text-primary-foreground px-5 py-2"
                onClick={() => setOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
