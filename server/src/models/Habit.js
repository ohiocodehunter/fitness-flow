import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: Date, default: Date.now, index: true },
    waterMl: { type: Number, default: 0 },
    sleepHours: { type: Number, default: 0 },
    steps: { type: Number, default: 0 },
    sleepQuality: { type: Number, min: 1, max: 10, default: 5 },
    soreness: { type: Number, min: 1, max: 10, default: 5 },
    energy: { type: Number, min: 1, max: 10, default: 5 },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Habit", habitSchema);