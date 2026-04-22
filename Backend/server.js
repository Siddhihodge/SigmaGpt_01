import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import mongoose from 'mongoose';
import OpenAI from 'openai';
import chatRoutes from './routes/chats.js';

const app = express();
const PORT = 8080;

/* =========================
   ENV VALIDATION
========================= */
if (!process.env.GROQ_API_KEY) {
  throw new Error("❌ GROQ_API_KEY is missing in .env");
}

if (!process.env.MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is missing in .env");
}

/* =========================
   GROQ CLIENT SETUP
========================= */
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());
app.use("/api", chatRoutes);

/* =========================
   TEST ROUTE
========================= */
app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});

/* =========================
   GROQ CHAT ROUTE
========================= */
app.post('/test', async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage || typeof userMessage !== 'string') {
      return res.status(400).json({ error: 'Invalid message' });
    }

    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: "You are Jarvis, a helpful AI assistant." },
        { role: "user", content: userMessage },
      ],
    });

    const reply = response.choices[0].message.content;

    res.json({ reply });

  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   DATABASE CONNECTION
========================= */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to Database");
  } catch (err) {
    console.error("❌ Failed to connect DB:", err);
    process.exit(1);
  }
};

/* =========================
   START SERVER
========================= */
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server failed to start:", err);
  }
};

startServer();