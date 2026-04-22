import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { requireAuth } from "../middleware/auth.js";
import Workout from "../models/Workout.js";
import Habit from "../models/Habit.js";
import BodyStat from "../models/BodyStat.js";

const router = express.Router();
router.use(requireAuth);

// ✅ Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

async function buildContext(userId) {
  const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 14);

  const [workouts, habits, stats] = await Promise.all([
    Workout.find({ user: userId, date: { $gte: since } })
      .sort({ date: -1 })
      .limit(20)
      .lean(),

    Habit.find({ user: userId, date: { $gte: since } })
      .sort({ date: -1 })
      .limit(20)
      .lean(),

    BodyStat.find({ user: userId, date: { $gte: since } })
      .sort({ date: -1 })
      .limit(20)
      .lean(),
  ]);

  return { workouts, habits, stats };
}

router.post("/chat", async (req, res) => {
  try {
    const { messages = [] } = req.body || {};

    if (!process.env.GEMINI_API_KEY) {
      return res
        .status(500)
        .json({ error: "GEMINI_API_KEY not configured on server" });
    }

    const ctx = await buildContext(req.userId);

    const systemPrompt = `
You are FitNotion's AI fitness coach. Be concise, practical, and motivating.
Use the user's recent data (last 14 days) to ground suggestions.
If data is sparse, ask one short clarifying question.

RECENT_WORKOUTS=${JSON.stringify(ctx.workouts).slice(0, 4000)}
RECENT_HABITS=${JSON.stringify(ctx.habits).slice(0, 2000)}
RECENT_BODY_STATS=${JSON.stringify(ctx.stats).slice(0, 2000)}
`;

    // Combine system + user messages
    const chatHistory = messages
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    const fullPrompt = `${systemPrompt}\n\n${chatHistory}\nAssistant:`;

    const model = genAI.getGenerativeModel({ model: MODEL });

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const reply = response.text();

    res.json({ reply });
  } catch (e) {
    console.error("Gemini AI error:", e);
    res.status(500).json({ error: e.message || "AI error" });
  }
});

export default router;
