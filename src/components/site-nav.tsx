import { Link, useRouterState } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

const links = [
  { to: "/", label: "Overview" },
  { to: "/project-input", label: "Project Input" },
] as const;

export function SiteNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-[color:var(--background)]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--accent)]/10 ring-1 ring-[color:var(--accent)]/30">
            <Sparkles className="h-4 w-4 text-[color:var(--accent)]" strokeWidth={1.75} />
            <span className="absolute inset-0 rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.35)]" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Nocturne
          </span>
          <span className="ml-1 hidden font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted-foreground)] sm:inline">
            v0.1
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map((link) => {
            const active =
              link.to === "/"
                ? pathname === "/"
                : pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:text-[color:var(--accent)] ${
                  active
                    ? "text-[color:var(--foreground)]"
                    : "text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-[1px] h-px bg-[color:var(--accent)] shadow-[0_0_12px_rgba(245,158,11,0.6)]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
