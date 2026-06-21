const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// 🔑 Gemini setup (PUT YOUR KEY HERE)
const genAI = new GoogleGenerativeAI("PASTE_YOUR_API_KEY_HERE");

// test route
app.get("/", (req, res) => {
    res.send("AI Fake News Detector Running");
});

// 🔥 AI VERIFY ROUTE
app.post("/verify", async (req, res) => {
    const { text } = req.body;

    console.log("Received:", text);

    if (!text || text.trim() === "") {
        return res.json({
            success: false,
            message: "No text provided"
        });
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash"
        });

        const prompt = `
You are an expert fake news detection system.

Analyze the given news and respond in STRICT format:

Verdict: (Real or Fake or Uncertain)
Confidence: (0-100)
Reason: (short explanation in simple English)

News:
${text}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiText = response.text();

        res.json({
            success: true,
            message: aiText
        });

    } catch (error) {
        console.error(error);

        res.json({
            success: false,
            message: "AI request failed"
        });
    }
});

// start server
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});