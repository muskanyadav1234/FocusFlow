import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Welcome back!");
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
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to pick up where you left off.</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <Field label="Email" type="email" value={email} onChange={setEmail} required />
            <Field label="Password" type="password" value={password} onChange={setPassword} required minLength={6} />
            <button type="submit" disabled={busy}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl gradient-aurora py-2.5 text-sm font-semibold text-white shadow-glow hover:opacity-95 disabled:opacity-60 transition">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link to="/signup" className="font-semibold text-foreground hover:underline">Create an account</Link>
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
        type={props.type}
        value={props.value}
        required={props.required}
        minLength={props.minLength}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 transition"
      />
    </label>
  );
}
