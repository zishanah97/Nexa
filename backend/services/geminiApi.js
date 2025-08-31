import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function getGeminiRecommendations(prompt) {
  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        params: { key: GEMINI_API_KEY },
        headers: { "Content-Type": "application/json" },
      }
    );

    const raw = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // 🔧 Strip markdown fences
    const clean = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // 🔧 Ensure array, not just object
    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch (err) {
      console.error("Failed to parse Gemini output:", clean);
      throw new Error("Invalid JSON from Gemini");
    }

    if (!Array.isArray(parsed)) {
      throw new Error("Gemini output is not an array");
    }

    return parsed;
  } catch (err) {
    console.error("Error in getGeminiRecommendations:", err);

    let errorMessage = err.message || "Unknown error";
    if (err.response && err.response.data) {
      errorMessage += " | Gemini says: " + JSON.stringify(err.response.data);
    }

    throw new Error(errorMessage);
  }
}
