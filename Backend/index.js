const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const axios = require("axios");

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "https://ai-support-chatbot-yv.vercel.app/", 
    credentials: true,
  })
);
app.use(express.json());

const PORT = process.env.PORT || 8001;

// ✅ Gemini chat endpoint with full history
app.post("/api/chat", async (req, res) => {
  const { contents } = req.body; // now expecting full history array

  if (!contents || !Array.isArray(contents)) {
    return res.status(400).json({ reply: "Invalid input format." });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { contents },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No reply.";
    res.json({ reply });
  } catch (err) {
    console.error("Gemini API Error:", err.response?.data || err.message);
    res.status(500).json({ reply: "Sorry, backend error occurred." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
