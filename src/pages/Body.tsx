import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Plus, Trash2, Scale } from "lucide-react";
import { format } from "date-fns";

type Stat = { _id: string; date: string; weight: number; calories: number; chest: number; waist: number; arms: number };

export default function Body() {
  const { user } = useAuth();
  const [items, setItems] = useState<Stat[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ weight: 75, calories: 2200, chest: 0, waist: 0, arms: 0 });

  const load = async () => setItems(await api<Stat[]>("/api/body-stats"));
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api("/api/body-stats", { method: "POST", body: form });
    setOpen(false);
    load();
  };

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Body Stats</h1>
          <p className="text-sm text-muted-foreground">Weight, calories, measurements — in {user?.units || "kg"}.</p>
        </div>
        <Button onClick={() => setOpen(!open)} className="bg-primary text-primary-foreground hover:bg-primary/90"><Plus className="mr-1 h-4 w-4" /> Add entry</Button>
      </div>

      {open && (
        <form onSubmit={submit} className="mt-6 surface rounded-xl border border-border p-6 space-y-4 animate-fade-in">
          <div className="grid gap-4 md:grid-cols-3">
            <div><Label>Weight ({user?.units || "kg"})</Label><Input type="number" step="0.1" value={form.weight} onChange={e => setForm({ ...form, weight: +e.target.value })} /></div>
            <div><Label>Calories</Label><Input type="number" value={form.calories} onChange={e => setForm({ ...form, calories: +e.target.value })} /></div>
            <div><Label>Chest (cm)</Label><Input type="number" step="0.1" value={form.chest} onChange={e => setForm({ ...form, chest: +e.target.value })} /></div>
            <div><Label>Waist (cm)</Label><Input type="number" step="0.1" value={form.waist} onChange={e => setForm({ ...form, waist: +e.target.value })} /></div>
            <div><Label>Arms (cm)</Label><Input type="number" step="0.1" value={form.arms} onChange={e => setForm({ ...form, arms: +e.target.value })} /></div>
          </div>
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Save</Button>
        </form>
      )}

      <div className="mt-8 space-y-3">
        {items.length === 0 && <p className="text-sm text-muted-foreground">No body stats logged yet.</p>}
        {items.map(s => (
          <div key={s._id} className="surface group flex items-center justify-between rounded-xl border border-border p-4 transition-all hover:border-primary/40">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Scale className="h-5 w-5" /></div>
              <div>
                <div className="font-semibold">{s.weight} {user?.units || "kg"} · {s.calories} kcal</div>
                <div className="text-xs text-muted-foreground">{format(new Date(s.date), "PP")}{s.chest ? ` · Chest ${s.chest}` : ""}{s.waist ? ` · Waist ${s.waist}` : ""}{s.arms ? ` · Arms ${s.arms}` : ""}</div>
              </div>
            </div>
            <button onClick={async () => { await api(`/api/body-stats/${s._id}`, { method: "DELETE" }); load(); }} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}