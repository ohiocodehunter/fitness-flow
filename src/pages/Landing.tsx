import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Flame,
  Dumbbell,
  Sparkles,
  HeartPulse,
  Activity,
  BarChart3,
  Brain,
  Calendar,
  CheckCircle2,
  LineChart,
  Moon,
  Quote,
  Scale,
  Tag,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

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
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
        </nav>
        <div className="flex gap-2">
          <Button asChild variant="ghost"><Link to="/auth">Sign in</Link></Button>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 glow"><Link to="/auth?mode=signup">Get started</Link></Button>
        </div>
      </header>

      {/* HERO */}
      <section className="container py-20 md:py-28 text-center animate-fade-in">
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
        <p className="mt-4 text-xs text-muted-foreground">No credit card • Free forever plan • Your data stays yours</p>

        {/* Trust strip */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { k: "12k+", v: "Workouts logged" },
            { k: "98%", v: "Weekly retention" },
            { k: "4.9★", v: "User rating" },
            { k: "<1s", v: "Page loads" },
          ].map((s) => (
            <div key={s.v} className="surface rounded-xl border border-border p-4">
              <div className="font-display text-2xl font-bold text-gradient">{s.k}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="container grid gap-4 pb-24 md:grid-cols-3">
        {[
          { icon: Dumbbell, title: "Workout logs", desc: "Sets, reps, weight, intensity. Search and filter by tag or date." },
          { icon: HeartPulse, title: "Recovery tracker", desc: "Sleep, soreness, energy. See weekly trends and recovery score." },
          { icon: Sparkles, title: "AI coach", desc: "Personalized suggestions trained on your last 14 days of data." },
          { icon: Scale, title: "Body stats", desc: "Track weight and measurements over time with clean charts." },
          { icon: Tag, title: "Tags & search", desc: "Organize logs with custom tags. Filter by date, type, or label." },
          { icon: Trophy, title: "Streaks & goals", desc: "Stay consistent with daily streaks and weekly targets." },
        ].map((f) => (
          <div key={f.title} className="surface rounded-2xl border border-border p-6 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-glow)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><f.icon className="h-5 w-5" /></div>
            <h3 className="mt-4 font-display text-xl font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="container pb-24">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold">From logging to insights in three steps</h2>
          <p className="mt-3 text-muted-foreground">A simple flow that compounds. Log today, learn this week, level up next month.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { n: "01", icon: Activity, title: "Log your training", desc: "Capture sets, reps, weight, RPE, and quick habit checks in seconds." },
            { n: "02", icon: LineChart, title: "See the trends", desc: "Auto-generated charts show intensity, recovery, and consistency over time." },
            { n: "03", icon: Brain, title: "Ask the AI coach", desc: "Get tailored programming and recovery tips grounded in your real data." },
          ].map((s) => (
            <div key={s.n} className="surface rounded-2xl border border-border p-6 relative overflow-hidden">
              <span className="absolute top-4 right-5 font-display text-5xl font-bold text-primary/10">{s.n}</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="container pb-24">
        <div className="surface rounded-3xl border border-border p-6 md:p-10">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-3 py-1 text-xs text-muted-foreground">
                <BarChart3 className="h-3 w-3 text-primary" /> Built-in analytics
              </div>
              <h2 className="mt-4 font-display text-3xl md:text-4xl font-bold">Your training, visualized</h2>
              <p className="mt-3 text-muted-foreground">Weekly volume, intensity heatmaps, and recovery scores. No spreadsheets, no fluff.</p>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  "Recovery score combining sleep, soreness, and energy",
                  "Workout intensity trends across the last 30 days",
                  "Tag-based filtering to compare push vs pull, or strength vs cardio",
                  "Export your data as JSON or CSV anytime",
                ].map((t) => (
                  <li key={t} className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> <span className="text-muted-foreground">{t}</span></li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Dumbbell, label: "Workouts", val: "24", sub: "this month" },
                { icon: Moon, label: "Avg sleep", val: "7.4h", sub: "last 7 days" },
                { icon: HeartPulse, label: "Recovery", val: "82", sub: "score" },
                { icon: Zap, label: "Streak", val: "12d", sub: "keep going" },
              ].map((c) => (
                <div key={c.label} className="rounded-xl border border-border bg-background/40 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{c.label}</span>
                    <c.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="mt-2 font-display text-2xl font-bold">{c.val}</div>
                  <div className="text-xs text-muted-foreground">{c.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container pb-24">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Lifters love the workflow</h2>
          <p className="mt-3 text-muted-foreground">Real feedback from real people training real hard.</p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            { q: "Finally a tracker that doesn't get in the way. Logging takes 30 seconds.", a: "Maya R.", r: "Powerlifter" },
            { q: "The AI coach picked up my fatigue pattern before I did. Game changer.", a: "Theo K.", r: "Hybrid athlete" },
            { q: "Replaces three apps and a spreadsheet. The dashboard alone is worth it.", a: "Priya S.", r: "Coach" },
          ].map((t) => (
            <div key={t.a} className="surface rounded-2xl border border-border p-6">
              <Quote className="h-5 w-5 text-primary" />
              <p className="mt-3 text-sm">{t.q}</p>
              <div className="mt-4 text-xs text-muted-foreground">{t.a} • {t.r}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="container pb-24">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Simple pricing</h2>
          <p className="mt-3 text-muted-foreground">Start free. Upgrade when you want deeper AI coaching.</p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 max-w-3xl mx-auto">
          {[
            { name: "Free", price: "$0", note: "Forever", perks: ["Unlimited workout logs", "Habit & body stat tracking", "Basic charts", "Tags & search"] },
            { name: "Pro", price: "$6", note: "/month", perks: ["Everything in Free", "Unlimited AI coach chats", "Advanced analytics", "CSV / JSON export"], highlight: true },
          ].map((p) => (
            <div
              key={p.name}
              className={`surface rounded-2xl border p-6 ${p.highlight ? "border-primary/50 shadow-[var(--shadow-glow)]" : "border-border"}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold">{p.name}</h3>
                {p.highlight && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">Popular</span>}
              </div>
              <div className="mt-4 flex items-end gap-1">
                <span className="font-display text-4xl font-bold">{p.price}</span>
                <span className="text-sm text-muted-foreground mb-1">{p.note}</span>
              </div>
              <ul className="mt-6 space-y-2 text-sm">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex gap-2 text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> {perk}</li>
                ))}
              </ul>
              <Button asChild className={`mt-6 w-full ${p.highlight ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`} variant={p.highlight ? "default" : "outline"}>
                <Link to="/auth?mode=signup">Get started</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container pb-24">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Questions, answered</h2>
        </div>
        <div className="mt-10 mx-auto max-w-3xl grid gap-3">
          {[
            { q: "Is my data private?", a: "Yes. Your logs are stored in your own MongoDB instance and only you can access them." },
            { q: "Do I need a wearable?", a: "No. FitNotion is manual-first by design — you stay in control of what gets logged." },
            { q: "How does the AI coach work?", a: "It reads your last 14 days of workouts and habits to give grounded, personalized suggestions." },
            { q: "Can I export my data?", a: "Yes — JSON and CSV export are built in. Take your data with you anytime." },
          ].map((f) => (
            <details key={f.q} className="group surface rounded-xl border border-border p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between font-medium">
                {f.q}
                <span className="text-primary transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <div className="surface rounded-3xl border border-border p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 -z-0 opacity-30 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.25),transparent_60%)]" />
          <div className="relative">
            <Target className="h-10 w-10 text-primary mx-auto" />
            <h2 className="mt-4 font-display text-3xl md:text-5xl font-bold">Ready to train with intent?</h2>
            <p className="mt-3 text-muted-foreground max-w-lg mx-auto">Join lifters using FitNotion to log smarter, recover faster, and stay consistent.</p>
            <Button asChild size="lg" className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90 glow">
              <Link to="/auth?mode=signup">Create your free account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="container border-t border-border py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Flame className="h-4 w-4" />
          </div>
          <span className="font-display font-semibold text-foreground">FitNotion</span>
          <span className="ml-2">© {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-5">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          <Link to="/auth" className="hover:text-foreground transition-colors">Sign in</Link>
        </div>
      </footer>
    </div>
  );
}