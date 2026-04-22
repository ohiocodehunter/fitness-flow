import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Flame, Dumbbell, Sparkles, HeartPulse } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <header className="container flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Flame className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold">FitNotion</span>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="ghost"><Link to="/auth">Sign in</Link></Button>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 glow"><Link to="/auth?mode=signup">Get started</Link></Button>
        </div>
      </header>

      <section className="container py-20 md:py-32 text-center animate-fade-in">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3 text-primary" /> Notion-style fitness tracker with an AI coach
        </div>
        <h1 className="mt-6 font-display text-5xl md:text-7xl font-bold tracking-tight">
          Track every rep. <br />
          <span className="text-gradient">Recover smarter.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Log workouts, habits, and body stats in one flexible workspace. Get AI-powered insights based on your real data.
        </p>
        <div className="mt-10 flex justify-center gap-3">
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow">
            <Link to="/auth?mode=signup">Start tracking free</Link>
          </Button>
          <Button asChild size="lg" variant="outline"><Link to="/auth">I have an account</Link></Button>
        </div>
      </section>

      <section className="container grid gap-4 pb-24 md:grid-cols-3">
        {[
          { icon: Dumbbell, title: "Workout logs", desc: "Sets, reps, weight, intensity. Search and filter by tag or date." },
          { icon: HeartPulse, title: "Recovery tracker", desc: "Sleep, soreness, energy. See weekly trends and recovery score." },
          { icon: Sparkles, title: "AI coach", desc: "Personalized suggestions trained on your last 14 days of data." },
        ].map((f) => (
          <div key={f.title} className="surface rounded-2xl border border-border p-6 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-glow)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><f.icon className="h-5 w-5" /></div>
            <h3 className="mt-4 font-display text-xl font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}