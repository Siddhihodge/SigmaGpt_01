import express from "express";
import "dotenv/config";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(cors());

// Test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// Gemini API route
app.post("/test", async (req, res) => {
  try {
    const userMessage = req.body.message || "Hello";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userMessage }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("====== GEMINI RESPONSE ======");
    console.log(JSON.stringify(data, null, 2));
    console.log("=============================");

    // Handle API error
    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    // Extract reply safely
    let reply = "No response";

    if (
      data &&
      data.candidates &&
      Array.isArray(data.candidates) &&
      data.candidates.length > 0
    ) {
      const parts = data.candidates[0].content?.parts || [];
      reply = parts.map(p => p.text || "").join("");
    }

    res.json({ reply });

  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});