import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Plus, Search, Pencil, Trash2, Check, ListFilter } from "lucide-react";
import { toast } from "sonner";
import { TaskDialog, priorityStyle, statusStyle, type Task } from "@/components/focus/TaskDialog";

export const Route = createFileRoute("/_authenticated/tasks")({ component: Tasks });

function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const [q, setQ] = useState("");
  const [priority, setPriority] = useState<"all" | "low" | "medium" | "high">("all");
  const [status, setStatus] = useState<"all" | "pending" | "in_progress" | "completed">("all");
  const [sort, setSort] = useState<"newest" | "oldest" | "priority" | "deadline">("newest");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("tasks").select("*");
    setTasks(data ?? []);
    setLoading(false);
  };

  useEffect(() => { if (user) load(); }, [user]);

  const filtered = useMemo(() => {
    const ord = { high: 0, medium: 1, low: 2 } as const;
    return tasks
      .filter(t => !q || t.title.toLowerCase().includes(q.toLowerCase()))
      .filter(t => priority === "all" || t.priority === priority)
      .filter(t => status === "all" || t.status === status)
      .sort((a, b) => {
        if (sort === "newest") return +new Date(b.created_at) - +new Date(a.created_at);
        if (sort === "oldest") return +new Date(a.created_at) - +new Date(b.created_at);
        if (sort === "priority") return ord[a.priority] - ord[b.priority];
        return (a.deadline ? +new Date(a.deadline) : Infinity) - (b.deadline ? +new Date(b.deadline) : Infinity);
      });
  }, [tasks, q, priority, status, sort]);

  const toggleComplete = async (t: Task) => {
    const completed = !t.completed;
    const { error } = await supabase.from("tasks").update({
      completed,
      status: completed ? "completed" : "pending",
      completed_at: completed ? new Date().toISOString() : null,
    }).eq("id", t.id);
    if (error) return toast.error(error.message);
    toast.success(completed ? "Marked complete" : "Marked pending");
    load();
  };

  const remove = async (t: Task) => {
    if (!confirm(`Delete "${t.title}"?`)) return;
    const { error } = await supabase.from("tasks").delete().eq("id", t.id);
    if (error) return toast.error(error.message);
    toast.success("Task deleted");
    load();
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 md:p-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Tasks</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage everything on your plate.</p>
        </div>
        <button onClick={() => { setEditing(null); setOpen(true); }}
          className="inline-flex items-center gap-2 rounded-xl gradient-aurora px-4 py-2.5 text-sm font-semibold text-white shadow-glow hover:opacity-95 transition">
          <Plus className="h-4 w-4" /> New task
        </button>
      </header>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title…"
              className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/30" />
          </div>
          <Select value={priority} onChange={(v) => setPriority(v as any)}
            options={[["all", "All priorities"], ["low", "Low"], ["medium", "Medium"], ["high", "High"]]} />
          <Select value={status} onChange={(v) => setStatus(v as any)}
            options={[["all", "All statuses"], ["pending", "Pending"], ["in_progress", "In progress"], ["completed", "Completed"]]} />
          <Select value={sort} onChange={(v) => setSort(v as any)} icon={<ListFilter className="h-3.5 w-3.5" />}
            options={[["newest", "Newest"], ["oldest", "Oldest"], ["priority", "Priority"], ["deadline", "Deadline"]]} />
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">{[0,1,2,3].map(i => <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-16 text-center">
          <p className="text-base font-medium">No tasks here yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Create your first task to start tracking your work.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map(t => (
            <li key={t.id} className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-soft transition hover:border-ring/50">
              <button onClick={() => toggleComplete(t)}
                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition ${
                  t.completed ? "border-success bg-success text-white" : "border-border hover:border-ring"
                }`}>
                {t.completed && <Check className="h-3 w-3" />}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className={`text-sm font-medium ${t.completed ? "text-muted-foreground line-through" : ""}`}>{t.title}</h3>
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${priorityStyle[t.priority]}`}>{t.priority}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusStyle[t.status]}`}>{t.status.replace("_", " ")}</span>
                </div>
                {t.description && <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>}
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  {t.deadline && <span>Due {new Date(t.deadline).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>}
                  {t.tags.length > 0 && <span className="flex gap-1">{t.tags.map(tag => <span key={tag} className="rounded-md bg-muted px-1.5 py-0.5">#{tag}</span>)}</span>}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100">
                <button onClick={() => { setEditing(t); setOpen(true); }} className="rounded-lg p-2 hover:bg-accent"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => remove(t)} className="rounded-lg p-2 text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {user && <TaskDialog open={open} onClose={() => setOpen(false)} onSaved={load} userId={user.id} initial={editing} />}
    </div>
  );
}

function Select({ value, onChange, options, icon }: { value: string; onChange: (v: string) => void; options: [string, string][]; icon?: React.ReactNode }) {
  return (
    <div className="relative">
      {icon && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>}
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className={`rounded-lg border border-input bg-background py-2 pr-8 text-sm outline-none focus:ring-2 focus:ring-ring/30 ${icon ? "pl-8" : "pl-3"}`}>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );
}
