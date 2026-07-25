import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth, useTheme } from "@/lib/auth";
import { LayoutDashboard, ListTodo, User, LogOut, Sparkles, Moon, Sun, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/_authenticated")({ component: AuthLayout });

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tasks", label: "Tasks", icon: ListTodo },
  { to: "/profile", label: "Profile", icon: User },
] as const;

function AuthLayout() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  useEffect(() => { setOpen(false); }, [path]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center mesh-bg">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const Sidebar = (
    <aside className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar p-4">
      <Link to="/dashboard" className="mb-8 flex items-center gap-2 px-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl gradient-aurora shadow-glow">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">FocusFlow</span>
      </Link>

      <nav className="flex-1 space-y-1">
        {nav.map((n) => {
          const active = path === n.to;
          return (
            <Link key={n.to} to={n.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-soft"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}>
              <n.icon className="h-4 w-4" />
              {n.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-sidebar-border pt-3">
        <button onClick={toggle}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
        <button onClick={() => signOut().then(() => navigate({ to: "/" }))}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition">
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="hidden md:block">{Sidebar}</div>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-card/50 px-4 py-3 md:hidden">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg gradient-aurora">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold">FocusFlow</span>
          </Link>
          <button onClick={() => setOpen(true)} className="rounded-lg p-2 hover:bg-accent">
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {open && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-64">
              {Sidebar}
              <button onClick={() => setOpen(false)} className="absolute right-3 top-3 rounded-lg p-2 hover:bg-accent">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
