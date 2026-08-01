import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, LogOut, Menu, ShieldCheck, UserRound, X } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{
    email?: string;
    avatarUrl?: string;
    initials: string;
    isDemo?: boolean;
  } | null>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
    <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-[color:var(--card-solid)]/70 backdrop-blur-[14px]">
      <div className="mx-auto flex max-w-[95%] items-center justify-between gap-4 px-4 py-3.5 sm:px-6 md:px-8">
        <div className="flex items-center gap-6">
          <Link to="/" className="group flex min-w-0 items-center">
            <Logo size="md" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-2">
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
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]">
                <Avatar className="h-8 w-8 border border-white/15">
                  {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt="Profile" />}
                  <AvatarFallback className="bg-[color:var(--accent)]/15 text-xs font-semibold text-[color:var(--accent)]">
                    {user?.initials ?? "SF"}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-3.5 w-3.5 text-[color:var(--muted-foreground)]" />
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
                    <UserRound className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => void signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
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

        {/* Mobile Hamburger Button & Avatar */}
        <div className="flex md:hidden items-center gap-2.5">
          {user && (
            <Link to="/profile">
              <Avatar className="h-7 w-7 border border-white/15">
                {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt="Profile" />}
                <AvatarFallback className="bg-[color:var(--accent)]/15 text-[10px] font-semibold text-[color:var(--accent)]">
                  {user?.initials ?? "SF"}
                </AvatarFallback>
              </Avatar>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] p-2 text-[color:var(--foreground)] hover:bg-white/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0c0c14]/95 backdrop-blur-2xl px-5 py-4 flex flex-col gap-3 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1.5">
            {links.map((link) => {
              const active = link.to === "/" ? pathname === "/" : pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    active
                      ? "bg-[color:var(--accent)]/15 text-[color:var(--accent)] font-semibold border border-[color:var(--accent)]/30"
                      : "text-[color:var(--muted-foreground)] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>{link.label}</span>
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-white/10 pt-3">
            {user ? (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <Avatar className="h-8 w-8 border border-white/15">
                    {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt="Profile" />}
                    <AvatarFallback className="bg-[color:var(--accent)]/15 text-xs font-semibold text-[color:var(--accent)]">
                      {user?.initials ?? "SF"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-[color:var(--foreground)]">
                      {user?.isDemo ? "Demo workspace" : user?.email ?? "Signed in"}
                    </p>
                    <p className="text-[10px] text-[color:var(--muted-foreground)]">Active session</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-[color:var(--foreground)] hover:bg-white/10"
                  >
                    <UserRound className="h-3.5 w-3.5" />
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      void signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300 hover:bg-red-500/20"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center rounded-xl bg-[color:var(--foreground)] px-4 py-2.5 text-sm font-semibold text-[color:var(--background)] transition-all hover:opacity-90"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
