const express = require("express");
const router = express.Router();

const { GoogleGenAI } = require("@google/genai");

// ✅ Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: "Prompt is required",
      });
    }

    // ✅ Latest Working Model
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    res.json({
      success: true,
      text: response.text,
    });
  } catch (error) {
    console.log("Gemini Error:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

