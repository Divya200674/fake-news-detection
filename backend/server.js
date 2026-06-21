require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const Tesseract = require("tesseract.js");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;
const SERPAPI_KEY = process.env.SERPAPI_KEY;

/* ---------------- CREATE UPLOADS ---------------- */
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

/* ---------------- MULTER ---------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

/* ---------------- TRUST TIERS ---------------- */
const TIER_1 = [".gov", ".nic.in", "india.gov.in", "eci.gov.in"];
const TIER_2 = [
  "reuters.com",
  "bbc.com",
  "thehindu.com",
  "indianexpress.com",
  "livemint.com"
];

function scoreLink(link) {
  const url = (link || "").toLowerCase();

  if (TIER_1.some(d => url.includes(d))) return 50;
  if (TIER_2.some(d => url.includes(d))) return 30;
  return 10;
}

/* ---------------- SERP SEARCH ---------------- */
async function searchNews(query) {
  const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${SERPAPI_KEY}`;
  const res = await axios.get(url);
  return res.data.organic_results || [];
}

/* ---------------- CORE ANALYSIS ---------------- */
async function analyzeText(text) {
  const results = await searchNews(text);

  let total = 0;

  const sources = results.slice(0, 5).map(r => {
    const score = scoreLink(r.link);
    total += score;

    return {
      title: r.title,
      link: r.link,
      score
    };
  });

  const finalScore = Math.min(100, total);

  let verdict = "UNVERIFIED";
  if (finalScore >= 70) verdict = "REAL";
  else if (finalScore <= 40) verdict = "FAKE";

  return { verdict, finalScore, sources };
}

/* ---------------- MAIN API ---------------- */
app.post("/analyze", upload.single("media"), async (req, res) => {
  try {
    const { text, mode } = req.body;

    let finalText = text || "";

    /* ---------------- IMAGE OCR ---------------- */
    if (req.file && req.file.mimetype.startsWith("image/")) {
      const ocr = await Tesseract.recognize(req.file.path, "eng");
      finalText += " " + ocr.data.text;
    }

    /* ---------------- VIDEO HANDLING ---------------- */
    if (req.file && req.file.mimetype.startsWith("video/")) {
      finalText += " " + req.file.originalname;
    }

    /* ---------------- EMPTY CHECK ---------------- */
    if (!finalText.trim()) {
      return res.json({
        success: false,
        verdict: "UNVERIFIED",
        score: 0,
        message: "No input provided"
      });
    }

    const result = await analyzeText(finalText);

    res.json({
      success: true,
      mode,
      ...result,
      extractedText: finalText
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/* ---------------- START ---------------- */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
app.get("/", (req, res) => {
  res.send("Fake News AI Backend is Running 🚀");
});