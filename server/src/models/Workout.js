import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sets: { type: Number, default: 0 },
    reps: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
  },
  { _id: false }
);

const workoutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    notes: { type: String, default: "" },
    date: { type: Date, default: Date.now, index: true },
    durationMin: { type: Number, default: 0 },
    intensity: { type: Number, min: 1, max: 10, default: 5 },
    tags: [{ type: String }],
    exercises: [exerciseSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Workout", workoutSchema);