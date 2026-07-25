import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

export type Task = Tables<"tasks">;
export type Priority = "low" | "medium" | "high";
export type Status = "pending" | "in_progress" | "completed";

export function TaskDialog({
  open, onClose, onSaved, userId, initial,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  userId: string;
  initial?: Task | null;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [status, setStatus] = useState<Status>("pending");
  const [deadline, setDeadline] = useState("");
  const [tags, setTags] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setDescription(initial.description ?? "");
      setPriority(initial.priority);
      setStatus(initial.status);
      setDeadline(initial.deadline ? initial.deadline.slice(0, 16) : "");
      setTags(initial.tags.join(", "));
    } else {
      setTitle(""); setDescription(""); setPriority("medium");
      setStatus("pending"); setDeadline(""); setTags("");
    }
  }, [initial, open]);

  if (!open) return null;

  const save = async () => {
    if (!title.trim()) { toast.error("Title is required"); return; }
    setBusy(true);
    const payload = {
      user_id: userId,
      title: title.trim(),
      description: description.trim(),
      priority, status,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      completed: status === "completed",
      completed_at: status === "completed" ? new Date().toISOString() : null,
    };

    const { error } = initial
      ? await supabase.from("tasks").update(payload).eq("id", initial.id)
      : await supabase.from("tasks").insert(payload);

    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success(initial ? "Task updated" : "Task created");
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center px-4">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-card p-6 shadow-glow">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{initial ? "Edit task" : "New task"}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-accent"><X className="h-4 w-4" /></button>
        </div>

        <div className="space-y-3">
          <Input label="Title" value={title} onChange={setTitle} />
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Description</span>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30" />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <Select label="Priority" value={priority} onChange={(v) => setPriority(v as Priority)}
              options={[["low", "Low"], ["medium", "Medium"], ["high", "High"]]} />
            <Select label="Status" value={status} onChange={(v) => setStatus(v as Status)}
              options={[["pending", "Pending"], ["in_progress", "In progress"], ["completed", "Completed"]]} />
          </div>

          <Input label="Deadline" type="datetime-local" value={deadline} onChange={setDeadline} />
          <Input label="Tags (comma separated)" value={tags} onChange={setTags} placeholder="work, urgent" />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent">Cancel</button>
          <button onClick={save} disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg gradient-aurora px-4 py-2 text-sm font-semibold text-white shadow-glow disabled:opacity-60">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} {initial ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30" />
    </label>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30">
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}

export const priorityStyle: Record<Priority, string> = {
  low: "bg-info/15 text-info border-info/30",
  medium: "bg-warning/15 text-warning border-warning/30",
  high: "bg-destructive/15 text-destructive border-destructive/30",
};
export const statusStyle: Record<Status, string> = {
  pending: "bg-muted text-muted-foreground border-border",
  in_progress: "bg-info/15 text-info border-info/30",
  completed: "bg-success/15 text-success border-success/30",
};
