import mongoose from "mongoose";

/* =========================
   MESSAGE SCHEMA
========================= */
const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

/* =========================
   THREAD SCHEMA
========================= */
const ThreadSchema = new mongoose.Schema(
  {
    threadId: {
      type: String,
      required: true,
      unique: true,
      index: true, // 🔥 faster queries
    },
    title: {
      type: String,
      default: "New Chat",
    },
    messages: [MessageSchema],
  },
  {
    timestamps: true, // 🔥 auto creates createdAt & updatedAt
  }
);

export default mongoose.model("Thread", ThreadSchema);