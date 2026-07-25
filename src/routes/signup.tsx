import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";

export const Route = createFileRoute("/signup")({ component: Signup });

function strength(p: string) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}

function Signup() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const s = strength(password);
  const labels = ["Too weak", "Weak", "Okay", "Strong", "Excellent"];
  const colors = ["bg-destructive", "bg-destructive", "bg-warning", "bg-info", "bg-success"];

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name }, emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Account created — welcome!");
    nav({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen mesh-bg grid place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl gradient-aurora shadow-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight">FocusFlow</span>
        </Link>

        <div className="glass rounded-2xl p-8 shadow-soft">
          <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Free forever for personal use.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <Field label="Your name" type="text" value={name} onChange={setName} required />
            <Field label="Email" type="email" value={email} onChange={setEmail} required />
            <Field label="Password" type="password" value={password} onChange={setPassword} required minLength={6} />

            {password && (
              <div>
                <div className="flex gap-1">
                  {[0,1,2,3].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition ${i < s ? colors[s-1] : "bg-muted"}`} />
                  ))}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{labels[s]}</p>
              </div>
            )}

            <button type="submit" disabled={busy}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl gradient-aurora py-2.5 text-sm font-semibold text-white shadow-glow hover:opacity-95 disabled:opacity-60 transition">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} Create account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-foreground hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field(props: { label: string; type: string; value: string; onChange: (v: string) => void; required?: boolean; minLength?: number }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{props.label}</span>
      <input
        type={props.type} value={props.value} required={props.required} minLength={props.minLength}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 transition"
      />
    </label>
  );
}
