// services/geminiApi.js
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
    console.log("Raw Gemini response:", raw);

    // Remove markdown code fences
    const clean = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log("Cleaned Gemini response:", clean);

    // Parse JSON safely
    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch (err) {
      console.error("Failed to parse Gemini output:", clean);
      throw new Error("Invalid JSON from Gemini");
    }

    // Ensure array output
    if (Array.isArray(parsed)) return parsed;

    if (parsed && typeof parsed === "object") {
      if (parsed.days) return parsed.days;           // { days: [...] }
      if (parsed.itinerary) return parsed.itinerary; // { itinerary: [...] }
      if (parsed.day && parsed.theme && parsed.activities) return [parsed]; // single day object

      // fallback: return first array property found
      const arrayProps = Object.values(parsed).filter(Array.isArray);
      if (arrayProps.length > 0) return arrayProps[0];
    }

    throw new Error(
      "Gemini output is not an array. Expected array format but got: " +
        typeof parsed
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
