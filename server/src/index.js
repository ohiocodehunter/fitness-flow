import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.js";
import workoutRoutes from "./routes/workouts.js";
import habitRoutes from "./routes/habits.js";
import bodyStatRoutes from "./routes/bodyStats.js";
import aiRoutes from "./routes/ai.js";
import meRoutes from "./routes/me.js";

const app = express();

// ✅ SIMPLE & CORRECT CORS
app.use(cors({
  origin: "https://fit-notion.netlify.app",
  credentials: true,
}));

app.use(express.json({ limit: "1mb" }));

app.use(
  rateLimit({
    windowMs: 60_000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/", (_req, res) => res.json({ ok: true, service: "fitnotion-api" }));
app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/me", meRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/body-stats", bodyStatRoutes);
app.use("/api/ai", aiRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`API listening on :${PORT}`));
  })
  .catch((err) => {
    console.error("Mongo connection error:", err);
    process.exit(1);
  });
