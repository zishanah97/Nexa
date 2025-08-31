import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function getGeminiRecommendations(prompt) {
  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      },
      {
        params: { key: GEMINI_API_KEY },
        headers: { "Content-Type": "application/json" },
      }
    );

    const raw = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("Raw Gemini response:", raw);

    const clean = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    console.log("Cleaned Gemini response:", clean);

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch (err) {
      console.error("Failed to parse Gemini output:", clean);
      throw new Error("Invalid JSON from Gemini");
    }

    // Handle both array (itinerary) and object (top places + budget) formats
    if (Array.isArray(parsed)) {
      return parsed; // itinerary
    }

    if (parsed && typeof parsed === "object") {
      // If it's an object with a 'days' array, convert to array (itinerary)
      if (parsed.days) return Array.isArray(parsed.days) ? parsed.days : [parsed.days];
      // Otherwise assume it's the top_places + budget object
      return parsed;
    }

    throw new Error(
      "Gemini output is neither an array nor a valid object: " + JSON.stringify(parsed)
    );
  } catch (err) {
    console.error("Error in getGeminiRecommendations:", err);
    let errorMessage = err.message || "Unknown error";
    if (err.response && err.response.data) {
      errorMessage += " | Gemini says: " + JSON.stringify(err.response.data);
    }
    throw new Error(errorMessage);
  }
}
