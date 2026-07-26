import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import smartFailureLogo from "../../Assets/Smart_Logo.png";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { clearDemoSession, hasDemoSession } from "@/lib/demo-session";

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

    function syncDemoUser() {
      if (hasDemoSession()) setUser({ email: "Demo user", initials: "DU", isDemo: true });
      else setUser(null);
    }

    void supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!mounted) return;
        if (!data.user && hasDemoSession()) {
          setUser({ email: "Demo user", initials: "DU", isDemo: true });
          return;
        }
        if (!data.user) return;
        const email = data.user.email ?? "";
        const name = data.user.user_metadata?.full_name ?? data.user.user_metadata?.name ?? email;
        const initials =
          name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part: string) => part[0])
            .join("")
            .toUpperCase() || "SF";

        setUser({
          email,
          avatarUrl: data.user.user_metadata?.avatar_url,
          initials,
        });
      })
      .catch(() => undefined);

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted && !session?.user) setUser(null);
    });
    window.addEventListener("smart-failure-demo-change", syncDemoUser);

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
      window.removeEventListener("smart-failure-demo-change", syncDemoUser);
    };
  }, []);

  async function signOut() {
    if (user?.isDemo) clearDemoSession();
    else await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-[color:var(--background)]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-5 px-5 py-3 md:px-8">
        <Link to="/" className="group flex min-w-0 items-center gap-2.5">
          <span className="flex h-9 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-white/90">
            <img
              src={smartFailureLogo}
              alt="Smart Failure Detection"
              className="h-full w-full scale-[2.2] object-cover object-center"
            />
          </span>
          <span className="truncate font-display text-sm font-semibold tracking-tight sm:text-base">
            Smart Failure Detection
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map((link) => {
            const active = link.to === "/" ? pathname === "/" : pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:text-[color:var(--accent)] ${
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
              className="rounded-md border border-white/12 px-3 py-1.5 text-xs font-medium text-[color:var(--foreground)] transition-colors hover:border-white/25 hover:bg-white/5"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
