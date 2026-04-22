import express from "express";
import Thread from "../models/Thread.js";
import getAIResponse from "../utils/openai.js"; // renamed (better naming)

const router = express.Router();

/* =========================
   TEST ROUTE
========================= */
router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "xyz",
      title: "Testing New Thread",
    });

    const response = await thread.save();
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save in DB" });
  }
});

/* =========================
   GET ALL THREADS
========================= */
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

/* =========================
   GET SINGLE THREAD
========================= */
router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({ threadId });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.json(thread.messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

/* =========================
   DELETE THREAD
========================= */
router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });

    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.json({ success: "Thread deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

/* =========================
   CHAT ROUTE (MAIN LOGIC)
========================= */
router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      // Create new thread
      thread = new Thread({
        threadId,
        title: message,
        messages: [],
      });
    }

    // Add user message
    thread.messages.push({
      role: "user",
      content: message,
    });

    /* =========================
       🔥 GROQ AI CALL
    ========================= */
    const assistantReply = await getAIResponse(message);

    // Add AI response
    thread.messages.push({
      role: "assistant",
      content: assistantReply,
    });

    thread.updatedAt = new Date();

    await thread.save();

    res.json({ reply: assistantReply });

  } catch (err) {
    console.error("CHAT ERROR:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;