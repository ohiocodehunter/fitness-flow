import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, HeartPulse } from "lucide-react";
import { format } from "date-fns";

type Habit = { _id: string; date: string; waterMl: number; sleepHours: number; steps: number; sleepQuality: number; soreness: number; energy: number; notes?: string };

export default function Recovery() {
  const [items, setItems] = useState<Habit[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ waterMl: 2000, sleepHours: 7, steps: 8000, sleepQuality: 7, soreness: 4, energy: 7, notes: "" });

  const load = async () => setItems(await api<Habit[]>("/api/habits"));
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { await api("/api/habits", { method: "POST", body: form }); setOpen(false); load(); }
    catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); }
  };

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Recovery</h1>
          <p className="text-sm text-muted-foreground">Sleep, soreness, energy — the metrics that matter.</p>
        </div>
        <Button onClick={() => setOpen(!open)} className="bg-primary text-primary-foreground hover:bg-primary/90"><Plus className="mr-1 h-4 w-4" /> Log day</Button>
      </div>

      {open && (
        <form onSubmit={submit} className="mt-6 surface rounded-xl border border-border p-6 space-y-4 animate-fade-in">
          <div className="grid gap-4 md:grid-cols-3">
            <div><Label>Water (ml)</Label><Input type="number" value={form.waterMl} onChange={e => setForm({ ...form, waterMl: +e.target.value })} /></div>
            <div><Label>Sleep (hours)</Label><Input type="number" step="0.1" value={form.sleepHours} onChange={e => setForm({ ...form, sleepHours: +e.target.value })} /></div>
            <div><Label>Steps</Label><Input type="number" value={form.steps} onChange={e => setForm({ ...form, steps: +e.target.value })} /></div>
            <div><Label>Sleep quality (1-10)</Label><Input type="number" min={1} max={10} value={form.sleepQuality} onChange={e => setForm({ ...form, sleepQuality: +e.target.value })} /></div>
            <div><Label>Soreness (1-10)</Label><Input type="number" min={1} max={10} value={form.soreness} onChange={e => setForm({ ...form, soreness: +e.target.value })} /></div>
            <div><Label>Energy (1-10)</Label><Input type="number" min={1} max={10} value={form.energy} onChange={e => setForm({ ...form, energy: +e.target.value })} /></div>
          </div>
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Save</Button>
        </form>
      )}

      <div className="mt-8 space-y-3">
        {items.length === 0 && <p className="text-sm text-muted-foreground">No recovery logs yet.</p>}
        {items.map(h => (
          <div key={h._id} className="surface group flex items-center justify-between rounded-xl border border-border p-4 transition-all hover:border-primary/40">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent"><HeartPulse className="h-5 w-5" /></div>
              <div>
                <div className="font-semibold">{format(new Date(h.date), "PP")}</div>
                <div className="text-xs text-muted-foreground">Sleep {h.sleepHours}h ({h.sleepQuality}/10) · Energy {h.energy}/10 · Soreness {h.soreness}/10 · {h.steps} steps</div>
              </div>
            </div>
            <button onClick={async () => { await api(`/api/habits/${h._id}`, { method: "DELETE" }); load(); }} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}