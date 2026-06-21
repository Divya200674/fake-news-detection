require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// check API key
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY missing in .env file");
  process.exit(1);
}

// init Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// IMPORTANT: use working model
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash"
});

// home route
app.get("/", (req, res) => {
  res.send("Fake News Detection API running 🚀");
});

// MAIN API
app.post("/verify-news", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "No text provided"
      });
    }

    const prompt = `
You are a strict fake news detector.

Analyze the news and respond ONLY in JSON:

{
  "verdict": "REAL | FAKE | UNVERIFIED",
  "score": 0-100,
  "reason": "short explanation"
}

News:
"""${text}"""
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const output = response.text();

    let parsed;
    try {
      parsed = JSON.parse(output);
    } catch (err) {
      parsed = {
        verdict: "UNVERIFIED",
        score: 50,
        reason: "Model did not return proper JSON",
        raw: output
      };
    }

    res.json({
      success: true,
      data: parsed
    });

  } catch (err) {
    console.error("ERROR:", err.message);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});