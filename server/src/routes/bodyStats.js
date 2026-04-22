import express from "express";
import { requireAuth } from "../middleware/auth.js";
import BodyStat from "../models/BodyStat.js";

const router = express.Router();
router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const { from, to, limit = 200 } = req.query;
    const filter = { user: req.userId };
    if (from || to) filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
    const items = await BodyStat.find(filter).sort({ date: -1 }).limit(Math.min(+limit, 500));
    res.json(items);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const item = await BodyStat.create({ ...req.body, user: req.userId });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const item = await BodyStat.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const r = await BodyStat.deleteOne({ _id: req.params.id, user: req.userId });
    res.json({ deleted: r.deletedCount });
  } catch (e) {
    next(e);
  }
});

export default router;