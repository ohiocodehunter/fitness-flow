import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import {
  Dumbbell,
  HeartPulse,
  Scale,
  Flame,
  Plus,
  Sparkles,
  TrendingUp,
  Moon,
  Zap,
  Calendar,
  ArrowRight,
  Trophy,
  Target,
} from "lucide-react";
import { format, subDays, startOfDay, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";

const Charts = lazy(() => import("@/components/dashboard/DashboardCharts"));

type Workout = { _id: string; date: string; intensity: number; durationMin: number; title: string };
type Habit = { _id: string; date: string; sleepQuality: number; soreness: number; energy: number; waterMl?: number; steps?: number };

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

  const recoveryScore = useMemo(() => {
    if (!habits.length) return 0;
    return Math.round(
      (habits.reduce((s, h) => s + (h.sleepQuality + h.energy + (10 - h.soreness)) / 3, 0) / habits.length) * 10
    );
  }, [habits]);

  const intensitySeries = useMemo(
    () =>
      [...workouts]
        .reverse()
        .map((w) => ({ date: format(new Date(w.date), "MMM d"), intensity: w.intensity, duration: w.durationMin })),
    [workouts]
  );

  // Weekly volume (minutes) for last 7 days
  const weeklyVolume = useMemo(() => {
    const days = Array.from({ length: 7 }).map((_, i) => startOfDay(subDays(new Date(), 6 - i)));
    return days.map((d) => {
      const total = workouts
        .filter((w) => isSameDay(new Date(w.date), d))
        .reduce((s, w) => s + (w.durationMin || 0), 0);
      return { day: format(d, "EEE"), minutes: total };
    });
  }, [workouts]);

  // Streak — consecutive days (back from today) with at least one workout
  const streak = useMemo(() => {
    let count = 0;
    for (let i = 0; i < 60; i++) {
      const d = startOfDay(subDays(new Date(), i));
      const has = workouts.some((w) => isSameDay(new Date(w.date), d));
      if (has) count++;
      else if (i > 0) break;
      else break;
    }
    return count;
  }, [workouts]);

  const totalMinutes = useMemo(() => workouts.reduce((s, w) => s + (w.durationMin || 0), 0), [workouts]);
  const avgSleep = useMemo(
    () => (habits.length ? (habits.reduce((s, h) => s + h.sleepQuality, 0) / habits.length).toFixed(1) : "—"),
    [habits]
  );

  const stats = [
    { label: "Workouts (30d)", value: workouts.length, icon: Dumbbell, sub: `${Math.round(workouts.length / 4)}/week avg` },
    { label: "Total minutes", value: totalMinutes, icon: Flame, sub: `${Math.round(totalMinutes / 60)}h trained` },
    { label: "Recovery score", value: recoveryScore || "—", icon: HeartPulse, sub: recoveryScore >= 70 ? "Feeling fresh" : "Take it easy" },
    { label: "Day streak", value: streak, icon: Trophy, sub: streak ? "Keep going" : "Start today" },
  ];

  const recentWorkouts = workouts.slice(0, 5);

  const tips = [
    { icon: Moon, title: "Aim for 7–9h sleep", desc: "Sleep is the #1 driver of recovery score." },
    { icon: Zap, title: "Deload every 4–6 weeks", desc: "Strategic rest weeks prevent fatigue plateaus." },
    { icon: Target, title: "Log right after training", desc: "Consistency compounds — log within 30 minutes." },
  ];

  return (
    <div className="container py-10 animate-fade-in">
      <header className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{format(new Date(), "EEEE, MMMM d")}</p>
          <h1 className="font-display text-4xl font-bold">Hey {user?.displayName || user?.email.split("@")[0]} 👋</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {streak > 0 ? `You're on a ${streak}-day streak — keep the momentum.` : "Log a workout today to start a streak."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm"><Link to="/recovery"><HeartPulse className="h-4 w-4 mr-1.5" /> Log recovery</Link></Button>
          <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/workouts"><Plus className="h-4 w-4 mr-1.5" /> New workout</Link>
          </Button>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="surface rounded-xl border border-border p-5 transition-all hover:border-primary/40">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3 font-display text-3xl font-bold">{s.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="surface rounded-xl border border-border p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold">Workout intensity</h2>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </div>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          {loading ? (
            <div className="h-64 animate-pulse rounded-lg bg-secondary/40 mt-4" />
          ) : intensitySeries.length === 0 ? (
            <div className="mt-8 text-center py-10">
              <Dumbbell className="h-10 w-10 text-muted-foreground/50 mx-auto" />
              <p className="mt-3 text-sm text-muted-foreground">No workouts yet. Log your first workout to see trends.</p>
              <Button asChild size="sm" className="mt-4"><Link to="/workouts">Log a workout</Link></Button>
            </div>
          ) : (
            <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-secondary/40 mt-4" />}>
              <Charts type="intensity" data={intensitySeries} />
            </Suspense>
          )}
        </div>

        <div className="surface rounded-xl border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold">Weekly volume</h2>
              <p className="text-xs text-muted-foreground">Minutes per day</p>
            </div>
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          {loading ? (
            <div className="h-64 animate-pulse rounded-lg bg-secondary/40 mt-4" />
          ) : (
            <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-secondary/40 mt-4" />}>
              <Charts type="volume" data={weeklyVolume} />
            </Suspense>
          )}
        </div>
      </div>

      {/* Recent + Recovery + Tips */}
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="surface rounded-xl border border-border p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Recent workouts</h2>
            <Button asChild variant="ghost" size="sm"><Link to="/workouts">View all <ArrowRight className="h-3 w-3 ml-1" /></Link></Button>
          </div>
          {loading ? (
            <div className="mt-4 space-y-2">
              {[0, 1, 2].map((i) => <div key={i} className="h-14 animate-pulse rounded-lg bg-secondary/40" />)}
            </div>
          ) : recentWorkouts.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">Nothing logged yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {recentWorkouts.map((w) => (
                <li key={w._id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{w.title || "Workout"}</div>
                    <div className="text-xs text-muted-foreground">{format(new Date(w.date), "MMM d")} • {w.durationMin || 0} min</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Intensity</span>
                    <span className="font-display font-semibold text-primary">{w.intensity}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="surface rounded-xl border border-border p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Recovery snapshot</h2>
            <HeartPulse className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0 rounded-full border-4 border-secondary flex items-center justify-center" style={{ borderTopColor: "hsl(var(--primary))" }}>
              <span className="font-display text-xl font-bold">{recoveryScore || "—"}</span>
            </div>
            <div className="text-sm">
              <div className="text-muted-foreground">Average sleep quality</div>
              <div className="font-display text-2xl font-semibold">{avgSleep}<span className="text-sm text-muted-foreground">/10</span></div>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="mt-5 w-full"><Link to="/recovery">Log today's recovery</Link></Button>
        </div>
      </div>

      {/* Tips + AI CTA */}
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {tips.map((t) => (
          <div key={t.title} className="surface rounded-xl border border-border p-5 hover:border-primary/40 transition-colors">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><t.icon className="h-4 w-4" /></div>
            <h3 className="mt-3 font-display font-semibold">{t.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 surface rounded-2xl border border-primary/30 p-6 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 -z-0 opacity-30 bg-[radial-gradient(ellipse_at_right,hsl(var(--primary)/0.25),transparent_60%)]" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs text-primary"><Sparkles className="h-3 w-3" /> AI Coach</div>
            <h3 className="mt-1 font-display text-2xl font-semibold">Need a plan for tomorrow?</h3>
            <p className="text-sm text-muted-foreground mt-1">Ask the coach — it knows your last 14 days.</p>
          </div>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 glow"><Link to="/coach">Open AI coach <ArrowRight className="h-4 w-4 ml-1.5" /></Link></Button>
        </div>
      </div>
    </div>
  );
}