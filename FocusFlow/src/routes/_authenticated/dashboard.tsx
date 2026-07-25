import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { CheckCircle2, Clock, Flame, ListTodo, Calendar } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";
import type { Tables } from "@/integrations/supabase/types";
import { priorityStyle } from "@/components/focus/TaskDialog";

export const Route = createFileRoute("/_authenticated/dashboard")({ component: Dashboard });

type Task = Tables<"tasks">;

function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: t }, { data: p }] = await Promise.all([
        supabase.from("tasks").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("name").eq("id", user.id).maybeSingle(),
      ]);
      setTasks(t ?? []);
      setName(p?.name ?? user.email?.split("@")[0] ?? "there");
      setLoading(false);
    })();
  }, [user]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.filter(t => !t.completed).length;
    const high = tasks.filter(t => t.priority === "high" && !t.completed).length;
    const pct = total ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, high, pct };
  }, [tasks]);

  const last7 = useMemo(() => {
    const days: { day: string; completed: number; created: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0,0,0,0);
      const next = new Date(d); next.setDate(next.getDate() + 1);
      days.push({
        day: d.toLocaleDateString(undefined, { weekday: "short" }),
        completed: tasks.filter(t => t.completed_at && new Date(t.completed_at) >= d && new Date(t.completed_at) < next).length,
        created: tasks.filter(t => new Date(t.created_at) >= d && new Date(t.created_at) < next).length,
      });
    }
    return days;
  }, [tasks]);

  const upcoming = useMemo(() =>
    tasks.filter(t => !t.completed && t.deadline)
      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
      .slice(0, 5),
    [tasks]
  );

  if (loading) return <div className="p-8"><Skeleton /></div>;

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 md:p-8">
      <header>
        <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">
          Welcome back, <span className="gradient-text">{name}</span>
        </h1>
        <p className="mt-2 text-muted-foreground">Here's how your work is shaping up.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={ListTodo} label="Total tasks" value={stats.total} accent="bg-accent text-accent-foreground" />
        <Stat icon={CheckCircle2} label="Completed" value={stats.completed} accent="bg-success/15 text-success" />
        <Stat icon={Clock} label="Pending" value={stats.pending} accent="bg-info/15 text-info" />
        <Stat icon={Flame} label="High priority" value={stats.high} accent="bg-destructive/15 text-destructive" />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Last 7 days</h2>
            <span className="text-xs text-muted-foreground">Completed vs created</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={last7} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.58 0.21 275)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.58 0.21 275)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0.02 270 / 0.15)" />
                <XAxis dataKey="day" stroke="currentColor" fontSize={12} className="text-muted-foreground" />
                <YAxis stroke="currentColor" fontSize={12} allowDecimals={false} className="text-muted-foreground" />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="completed" stroke="oklch(0.58 0.21 275)" strokeWidth={2} fill="url(#g1)" />
                <Area type="monotone" dataKey="created" stroke="oklch(0.7 0.15 230)" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-base font-semibold">Completion rate</h2>
          <p className="mt-1 text-sm text-muted-foreground">Across all your tasks</p>
          <div className="mt-6 grid place-items-center">
            <div className="relative h-40 w-40">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--muted)" strokeWidth="10" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="url(#grad)" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${(stats.pct / 100) * 263.9} 263.9`} />
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="oklch(0.58 0.21 275)" />
                    <stop offset="100%" stopColor="oklch(0.7 0.18 200)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <span className="text-3xl font-semibold">{stats.pct}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="mb-4 text-base font-semibold">Tasks by priority</h2>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={[
                { p: "Low", count: tasks.filter(t => t.priority === "low").length },
                { p: "Medium", count: tasks.filter(t => t.priority === "medium").length },
                { p: "High", count: tasks.filter(t => t.priority === "high").length },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.5 0.02 270 / 0.15)" />
                <XAxis dataKey="p" stroke="currentColor" fontSize={12} className="text-muted-foreground" />
                <YAxis stroke="currentColor" fontSize={12} allowDecimals={false} className="text-muted-foreground" />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="count" fill="oklch(0.58 0.21 275)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold"><Calendar className="h-4 w-4" /> Upcoming deadlines</h2>
          {upcoming.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No deadlines on the horizon. Enjoy the calm.</p>
          ) : (
            <ul className="space-y-2">
              {upcoming.map(t => (
                <li key={t.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{t.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(t.deadline!).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${priorityStyle[t.priority]}`}>
                    {t.priority}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function Stat({ icon: Icon, label, value, accent }: { icon: any; label: string; value: number; accent: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className={`grid h-9 w-9 place-items-center rounded-lg ${accent}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0,1,2,3].map(i => <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />)}
      </div>
      <div className="h-72 animate-pulse rounded-2xl bg-muted" />
    </div>
  );
}
