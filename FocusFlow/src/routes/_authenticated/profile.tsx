import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useTheme } from "@/lib/auth";
import { toast } from "sonner";
import { Camera, Loader2, Moon, Sun } from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({ component: Profile });

function Profile() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
      .then(({ data }) => { if (data) { setName(data.name); setAvatar(data.avatar_url); } });
  }, [user]);

  const save = async () => {
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from("profiles").update({ name }).eq("id", user.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
  };

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (upErr) { setUploading(false); return toast.error(upErr.message); }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);
    setAvatar(publicUrl);
    setUploading(false);
    toast.success("Avatar updated");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6 md:p-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage how you appear in FocusFlow.</p>
      </header>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-full gradient-aurora text-2xl font-semibold text-white shadow-glow">
              {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : (name || "U").charAt(0).toUpperCase()}
            </div>
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border-2 border-card bg-foreground text-background hover:opacity-90 disabled:opacity-60">
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPick} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-medium">{user?.email}</p>
            <p className="text-sm text-muted-foreground">Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Display name</span>
            <input value={name} onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30" />
          </label>
          <button onClick={save} disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg gradient-aurora px-4 py-2 text-sm font-semibold text-white shadow-glow disabled:opacity-60">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Save changes
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="text-base font-semibold">Appearance</h2>
        <p className="mt-1 text-sm text-muted-foreground">Pick the look that suits your eyes.</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button onClick={() => setTheme("light")}
            className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${theme === "light" ? "border-ring ring-2 ring-ring/30" : "border-border hover:border-ring/50"}`}>
            <Sun className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Light</p>
              <p className="text-xs text-muted-foreground">Bright and clean</p>
            </div>
          </button>
          <button onClick={() => setTheme("dark")}
            className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${theme === "dark" ? "border-ring ring-2 ring-ring/30" : "border-border hover:border-ring/50"}`}>
            <Moon className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium">Dark</p>
              <p className="text-xs text-muted-foreground">Easy on the eyes</p>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}
