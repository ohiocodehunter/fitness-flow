import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    displayName: { type: String, default: "" },
    units: { type: String, enum: ["kg", "lb"], default: "kg" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);