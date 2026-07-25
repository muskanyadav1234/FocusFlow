import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { CheckCircle2, BarChart3, Bell, Sparkles, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/dashboard" });
  },
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen mesh-bg">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl gradient-aurora shadow-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight">FocusFlow</span>
        </div>
        <nav className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">Sign in</Link>
          <Link to="/signup" className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition">
            Get started <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 pt-12 pb-24">
        <section className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3 w-3" /> A calmer way to get things done
          </span>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl">
            Stay in <span className="gradient-text">flow</span>.<br />
            Ship what matters.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            FocusFlow is a modern task and productivity manager. Plan your day, track deadlines, and watch your progress unfold in beautiful charts.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3">
            <Link to="/signup" className="rounded-xl gradient-aurora px-6 py-3 text-sm font-semibold text-white shadow-glow hover:opacity-95 transition">
              Create free account
            </Link>
            <Link to="/login" className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold hover:bg-accent transition">
              I already have one
            </Link>
          </div>
        </section>

        <section className="mt-24 grid gap-6 md:grid-cols-3">
          {[
            { icon: CheckCircle2, title: "Smart task management", desc: "Priorities, statuses, deadlines and tags — all in one calm interface." },
            { icon: BarChart3, title: "Productivity insights", desc: "See completed work per day and weekly trends with crisp charts." },
            { icon: Bell, title: "Deadline reminders", desc: "Never miss what's due. Upcoming deadlines surface right on your dashboard." },
          ].map((f, i) => (
            <div key={i} className="glass rounded-2xl p-6 shadow-soft">
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
