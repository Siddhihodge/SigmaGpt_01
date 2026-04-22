import "dotenv/config";
import OpenAI from "openai";

/* =========================
   GROQ CLIENT SETUP
========================= */
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

/* =========================
   FUNCTION
========================= */
const getOpenAIAPIResponse = async (message) => {
  try {
    if (!message || typeof message !== "string") {
      throw new Error("Invalid message input");
    }

    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: message },
      ],
    });

    const reply = response.choices[0].message.content;

    return reply;

  } catch (err) {
    console.error("Groq API Error:", err.message);
    return "Error generating response";
  }
};

export default getOpenAIAPIResponse;