import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Dumbbell } from "lucide-react";
import { format } from "date-fns";

type Workout = {
  _id: string;
  title: string;
  notes?: string;
  date: string;
  durationMin: number;
  intensity: number;
  tags: string[];
};

export default function Workouts() {
  const [items, setItems] = useState<Workout[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", notes: "", durationMin: 45, intensity: 7, tags: "" });

  const load = async () => setItems(await api<Workout[]>("/api/workouts"));
  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/api/workouts", {
        method: "POST",
        body: { ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) },
      });
      setOpen(false);
      setForm({ title: "", notes: "", durationMin: 45, intensity: 7, tags: "" });
      load();
    } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
  };

  const remove = async (id: string) => {
    await api(`/api/workouts/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Workouts</h1>
          <p className="text-sm text-muted-foreground">Log every session, track intensity over time.</p>
        </div>
        <Button onClick={() => setOpen(!open)} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-1 h-4 w-4" /> New workout
        </Button>
      </div>

      {open && (
        <form onSubmit={create} className="mt-6 surface rounded-xl border border-border p-6 space-y-4 animate-fade-in">
          <div className="grid gap-4 md:grid-cols-2">
            <div><Label>Title</Label><Input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Push day" /></div>
            <div><Label>Tags (comma-separated)</Label><Input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="upper, strength" /></div>
            <div><Label>Duration (min)</Label><Input type="number" value={form.durationMin} onChange={e => setForm({ ...form, durationMin: +e.target.value })} /></div>
            <div><Label>Intensity (1-10)</Label><Input type="number" min={1} max={10} value={form.intensity} onChange={e => setForm({ ...form, intensity: +e.target.value })} /></div>
          </div>
          <div><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="3x8 bench, 4x10 rows…" /></div>
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Save workout</Button>
        </form>
      )}

      <div className="mt-8 space-y-3">
        {items.length === 0 && <p className="text-sm text-muted-foreground">No workouts yet.</p>}
        {items.map(w => (
          <div key={w._id} className="surface group flex items-center justify-between rounded-xl border border-border p-4 transition-all hover:border-primary/40">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Dumbbell className="h-5 w-5" /></div>
              <div>
                <div className="font-semibold">{w.title}</div>
                <div className="text-xs text-muted-foreground">{format(new Date(w.date), "PP")} · {w.durationMin} min · intensity {w.intensity}/10</div>
                {w.tags.length > 0 && <div className="mt-1 flex gap-1">{w.tags.map(t => <span key={t} className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{t}</span>)}</div>}
              </div>
            </div>
            <button onClick={() => remove(w._id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}