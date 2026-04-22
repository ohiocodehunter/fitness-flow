import express from "express";
import { requireAuth } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const u = await User.findById(req.userId).lean();
    if (!u) return res.status(404).json({ error: "Not found" });
    res.json({ id: u._id, email: u.email, displayName: u.displayName, units: u.units });
  } catch (e) {
    next(e);
  }
});

router.patch("/", requireAuth, async (req, res, next) => {
  try {
    const { displayName, units } = req.body || {};
    const update = {};
    if (typeof displayName === "string") update.displayName = displayName.slice(0, 80);
    if (units === "kg" || units === "lb") update.units = units;
    const u = await User.findByIdAndUpdate(req.userId, update, { new: true }).lean();
    res.json({ id: u._id, email: u.email, displayName: u.displayName, units: u.units });
  } catch (e) {
    next(e);
  }
});

export default router;