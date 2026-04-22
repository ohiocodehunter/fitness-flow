import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Dumbbell, HeartPulse, Scale, Flame } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { format, subDays } from "date-fns";

type Workout = { _id: string; date: string; intensity: number; durationMin: number; title: string };
type Habit = { _id: string; date: string; sleepQuality: number; soreness: number; energy: number };

export default function Dashboard() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const from = subDays(new Date(), 30).toISOString();
        const [w, h] = await Promise.all([
          api<Workout[]>(`/api/workouts?from=${from}`),
          api<Habit[]>(`/api/habits?from=${from}`),
        ]);
        setWorkouts(w);
        setHabits(h);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const recoveryScore = habits.length
    ? Math.round(
        habits.reduce((s, h) => s + (h.sleepQuality + h.energy + (10 - h.soreness)) / 3, 0) / habits.length * 10
      )
    : 0;

  const intensitySeries = [...workouts]
    .reverse()
    .map((w) => ({ date: format(new Date(w.date), "MMM d"), intensity: w.intensity, duration: w.durationMin }));

  const stats = [
    { label: "Workouts (30d)", value: workouts.length, icon: Dumbbell },
    { label: "Total minutes", value: workouts.reduce((s, w) => s + (w.durationMin || 0), 0), icon: Flame },
    { label: "Recovery score", value: recoveryScore || "—", icon: HeartPulse },
    { label: "Habit logs", value: habits.length, icon: Scale },
  ];

  return (
    <div className="container py-10">
      <header className="mb-8">
        <p className="text-sm text-muted-foreground">{format(new Date(), "EEEE, MMMM d")}</p>
        <h1 className="font-display text-4xl font-bold">Hey {user?.displayName || user?.email.split("@")[0]} 👋</h1>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="surface rounded-xl border border-border p-5 transition-all hover:border-primary/40">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3 font-display text-3xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 surface rounded-xl border border-border p-6">
        <h2 className="font-display text-xl font-semibold">Workout intensity (last 30 days)</h2>
        {loading ? (
          <div className="h-64 animate-pulse rounded-lg bg-secondary/40 mt-4" />
        ) : intensitySeries.length === 0 ? (
          <p className="mt-6 text-sm text-muted-foreground">No workouts yet. Log your first workout to see trends.</p>
        ) : (
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={intensitySeries}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                />
                <Line type="monotone" dataKey="intensity" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}