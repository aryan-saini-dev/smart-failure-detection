import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clearDemoSession, hasDemoSession } from "@/lib/demo-session";
import { clearSessionToken, getCurrentUser } from "@/lib/local-api";

const links = [
  { to: "/", label: "Overview" },
  { to: "/project-input", label: "Project Input" },
] as const;

export function SiteNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [user, setUser] = useState<{
    email?: string;
    avatarUrl?: string;
    initials: string;
    isDemo?: boolean;
  } | null>(null);

  useEffect(() => {
    let mounted = true;

    function syncAuth() {
      void getCurrentUser()
        .then(({ user }) => {
          if (!mounted) return;
          if (!user) {
            if (hasDemoSession()) {
              setUser({ email: "Demo user", initials: "DU", isDemo: true });
            } else {
              setUser(null);
            }
            return;
          }
          const initials =
            user.name
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .map((part: string) => part[0])
              .join("")
              .toUpperCase() || "SF";
          setUser({
            email: user.email,
            avatarUrl: user.avatarUrl,
            initials,
          });
        })
        .catch(() => {
          if (mounted) setUser(null);
        });
    }

    syncAuth();

    window.addEventListener("smart-failure-demo-change", syncAuth);
    window.addEventListener("smart-failure-auth-change", syncAuth);

    return () => {
      mounted = false;
      window.removeEventListener("smart-failure-demo-change", syncAuth);
      window.removeEventListener("smart-failure-auth-change", syncAuth);
    };
  }, []);

  async function signOut() {
    if (user?.isDemo) clearDemoSession();
    else clearSessionToken();
    setUser(null);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-[color:var(--card-solid)]/60 backdrop-blur-[12px]">
      <div className="mx-auto flex max-w-[95%] items-center gap-6 px-5 py-4 md:px-8">
        <Link to="/" className="group flex min-w-0 items-center mr-2">
          <Logo size="md" />
        </Link>

        <nav className="flex items-center gap-2">
          {links.map((link) => {
            const active = link.to === "/" ? pathname === "/" : pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] ${
                  active
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-[color:var(--muted-foreground)] hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center">
          {user ? (
            <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]">
              <Avatar className="h-8 w-8 border border-white/15">
                {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt="Profile" />}
                <AvatarFallback className="bg-[color:var(--accent)]/15 text-xs font-semibold text-[color:var(--accent)]">
                  {user?.initials ?? "SF"}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="hidden h-3.5 w-3.5 text-[color:var(--muted-foreground)] sm:block" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[color:var(--accent)]" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">Workspace account</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user?.isDemo ? "Local demo workspace" : user?.email ?? "Signed in"}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">
                  <UserRound />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => void signOut()}>
                <LogOut />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-white/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
