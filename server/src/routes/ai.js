import express from "express";
import OpenAI from "openai";
import { requireAuth } from "../middleware/auth.js";
import Workout from "../models/Workout.js";
import Habit from "../models/Habit.js";
import BodyStat from "../models/BodyStat.js";

const router = express.Router();
router.use(requireAuth);

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

async function buildContext(userId) {
  const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 14);
  const [workouts, habits, stats] = await Promise.all([
    Workout.find({ user: userId, date: { $gte: since } }).sort({ date: -1 }).limit(20).lean(),
    Habit.find({ user: userId, date: { $gte: since } }).sort({ date: -1 }).limit(20).lean(),
    BodyStat.find({ user: userId, date: { $gte: since } }).sort({ date: -1 }).limit(20).lean(),
  ]);
  return { workouts, habits, stats };
}

router.post("/chat", async (req, res, next) => {
  try {
    const { messages = [] } = req.body || {};
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OPENAI_API_KEY not configured on server" });
    }
    const ctx = await buildContext(req.userId);
    const system = `You are FitNotion's AI fitness coach. Be concise, practical, and motivating.
Use the user's recent data (last 14 days) to ground suggestions.
If data is sparse, ask one short clarifying question.

RECENT_WORKOUTS=${JSON.stringify(ctx.workouts).slice(0, 4000)}
RECENT_HABITS=${JSON.stringify(ctx.habits).slice(0, 2000)}
RECENT_BODY_STATS=${JSON.stringify(ctx.stats).slice(0, 2000)}`;

    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: "system", content: system }, ...messages],
      temperature: 0.7,
    });
    const reply = completion.choices?.[0]?.message?.content || "";
    res.json({ reply });
  } catch (e) {
    console.error("AI error:", e);
    res.status(500).json({ error: e.message || "AI error" });
  }
});

export default router;