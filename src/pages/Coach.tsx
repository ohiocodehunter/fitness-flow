import { useState, useRef, useEffect } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

export default function Coach() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hey! I'm your AI coach. Ask me about your training, recovery, or what to do next." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: input };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const r = await api<{ reply: string }>("/api/ai/chat", { method: "POST", body: { messages: next.slice(-12) } });
      setMessages([...next, { role: "assistant", content: r.reply || "(no response)" }]);
    } catch (e: any) {
      setMessages([...next, { role: "assistant", content: `Error: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-3xl py-10">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary animate-pulse-glow"><Sparkles className="h-5 w-5" /></div>
        <div>
          <h1 className="font-display text-3xl font-bold">AI Coach</h1>
          <p className="text-sm text-muted-foreground">Personalized advice from your last 14 days of data.</p>
        </div>
      </div>

      <div className="mt-6 surface rounded-xl border border-border p-4 h-[60vh] overflow-y-auto space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start"><div className="rounded-2xl bg-secondary px-4 py-3 text-sm text-muted-foreground">Thinking…</div></div>
        )}
        <div ref={endRef} />
      </div>

      <div className="mt-4 flex gap-2">
        <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="What should I train tomorrow?" />
        <Button onClick={send} disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90"><Send className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}