
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const OPENCODEZEN_API_KEY = process.env.OPENCODEZEN_API_KEY;
const OPENCODEZEN_BASE_URL = process.env.OPENCODEZEN_BASE_URL || "https://opencode.ai/zen/v1";
const OPENCODEZEN_MODEL = process.env.OPENCODEZEN_MODEL || "mimo-v2.5-free";

export async function getGeminiRecommendations(prompt) {
  try {
    console.log(`[OpenCodeZen] Calling model: ${OPENCODEZEN_MODEL}`);

    const response = await axios.post(
      `${OPENCODEZEN_BASE_URL}/chat/completions`,
      {
        model: OPENCODEZEN_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are Nexa, an expert AI travel planner. Always respond with valid JSON only. No markdown, no extra text.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 8192,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENCODEZEN_API_KEY}`,
        },
        timeout: 300000, // 5 minute timeout for large responses
      }
    );

    const raw =
      response.data?.choices?.[0]?.message?.content || "";
    console.log("[OpenCodeZen] Raw response length:", raw.length);

    // Strip markdown code fences if model wraps JSON in them
    let clean = raw.trim();
    if (clean.startsWith("```json")) {
      clean = clean.replace(/^```json\s*/i, "");
    } else if (clean.startsWith("```")) {
      clean = clean.replace(/^```\s*/i, "");
    }
    if (clean.endsWith("```")) {
      clean = clean.replace(/```\s*$/i, "");
    }
    clean = clean.trim();

    // Fallback: extract substring from first { or [ to last } or ]
    const firstBrace = clean.indexOf('{');
    const firstBracket = clean.indexOf('[');
    let startIndex = -1;
    if (firstBrace !== -1 && firstBracket !== -1) {
      startIndex = Math.min(firstBrace, firstBracket);
    } else {
      startIndex = Math.max(firstBrace, firstBracket);
    }
    
    const lastBrace = clean.lastIndexOf('}');
    const lastBracket = clean.lastIndexOf(']');
    const endIndex = Math.max(lastBrace, lastBracket);
    
    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      clean = clean.substring(startIndex, endIndex + 1);
    }

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch (err) {
      console.error("[OpenCodeZen] Failed to parse JSON output:", clean.slice(0, 500));
      throw new Error("Invalid JSON from OpenCodeZen / Nemotron");
    }

    // Handle both array (itinerary) and object (top places + budget) formats
    if (Array.isArray(parsed)) {
      return parsed; // itinerary
    }

    if (parsed && typeof parsed === "object") {
      // If it's an object with a 'days' array, convert to array (itinerary)
      if (parsed.days)
        return Array.isArray(parsed.days) ? parsed.days : [parsed.days];
      // Otherwise assume it's the top_places + budget object
      return parsed;
    }

    throw new Error(
      "Output is neither an array nor a valid object: " +
        JSON.stringify(parsed)
    );
  } catch (err) {
    console.error("[OpenCodeZen] Error:", err.message);
    let errorMessage = err.message || "Unknown error";
    if (err.response && err.response.data) {
      errorMessage +=
        " | API says: " + JSON.stringify(err.response.data);
    }
    throw new Error(errorMessage);
  }
}
