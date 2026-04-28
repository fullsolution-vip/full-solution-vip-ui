import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground font-medium" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/wholesale"
            className="text-sm rounded-full bg-primary text-primary-foreground px-5 py-2.5 hover:opacity-90 transition-opacity"
          >
            Become a Stockist
          </Link>
        </nav>

        <button
          className="md:hidden p-2 -mr-2"
          onClick={() => setOpen((s) => !s)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

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
              className="py-3 text-sm text-muted-foreground"
              activeProps={{ className: "text-foreground font-medium" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
