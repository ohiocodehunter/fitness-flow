import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User.js";

const router = express.Router();

const credSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(6).max(100),
  displayName: z.string().trim().max(80).optional(),
});

function sign(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function publicUser(u) {
  return { id: u._id, email: u.email, displayName: u.displayName, units: u.units };
}

router.post("/signup", async (req, res, next) => {
  try {
    const { email, password, displayName } = credSchema.parse(req.body);
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "Email already registered" });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, displayName: displayName || "" });
    res.json({ token: sign(user), user: publicUser(user) });
  } catch (e) {
    if (e.name === "ZodError") return res.status(400).json({ error: e.errors[0].message });
    next(e);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = credSchema.parse(req.body);
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    res.json({ token: sign(user), user: publicUser(user) });
  } catch (e) {
    if (e.name === "ZodError") return res.status(400).json({ error: e.errors[0].message });
    next(e);
  }
});

export default router;