import { getGeminiRecommendations } from "../services/geminiApi.js";
import { fetchPixabayImages } from "../services/pixabayApi.js";
import dotenv from "dotenv";
// Removed incorrect React import - this is a backend file

dotenv.config();

const getRecommendations = async (req, res) => {
  try {
    const preferences = req.body.preferences;
    const prompt = `
You are Nexa, an expert AI travel planner.

GOAL
Produce a FRONT VIEW response in three parts for the given user inputs:
1) TOP 10 PLACES: Curated, feasible options under the user's price range and days.
2) BUDGET STRETCH ADVISOR: High-value upgrades unlocked with a modest budget increase.
3) BUDGET CUT OPTIMIZER: Smart cost-saving swaps while keeping the trip enjoyable.

USER INPUTS
- LOCATION: ${preferences.location}          
- NUM_PEOPLE:  ${preferences.numPeople}
- PRICE_RANGE: ${preferences.budget}     
- DAYS:  ${preferences.days}                  

SCOPING & GRANULARITY RULES
- If LOCATION is a country/large region → pick cities/regions within it.
- If LOCATION is a city → pick neighborhoods, districts, or nearby day-trip spots.
- If LOCATION is a specific landmark/spot → pick the 15 best nearby experiences/areas within a practical radius (≤100 km) for half-day/full-day plans.
- Always ensure every suggestion is realistically doable within DAYS and PRICE_RANGE for NUM_PEOPLE.

BUDGET LOGIC
- Interpret PRICE_RANGE as per-person comfort tier and reflect that in choices.
- Use local norms to keep costs believable. If needed, assume typical affordable transport/stays for "budget", boutique for "mid", and premium experiences for "luxury".
- Costs should be estimates, not quotes.

OUTPUT FORMAT (STRICT JSON ONLY; NO EXTRA TEXT)
{
  "preferences": {
    "location": "${preferences.location}",
    "numPeople": ${preferences.numPeople},
    "budget": "${preferences.budget}",
    "days": ${preferences.days}
  },
  "top_places": [
    {
      "id": "kebab-case-unique-id",
      "name": "string",
      "scope_type": "city|region|neighborhood|landmark|experience",
      "short_reason": "≤18 words, why this fits the user's inputs",
      "primary_vibes": ["choose up to 3 from: nature, culture, food, adventure, nightlife, relaxation, shopping, history, photography"],
      "ideal_duration": "half-day|1 day|2-3 days|4+ days",
      "fit_score": 0-100, // relevance vs inputs (higher = better)
      "est_daily_cost_per_person": { "min": number, "max": number },
      "best_months": ["3-letter month names, e.g., Nov","Dec"],
      "image_search_query": "succinct query the frontend can use (e.g., 'Halong Bay limestone karsts sunset')",
      "map_hint": "area or landmark to center a map on",
      "local_foods": [
        { "name": "string", "desc": "short description", "price": number, "mustTry": boolean }
      ],
      "insider_tips": ["string", "string", "string"],
      "budget_breakdown": { "accommodation": number, "food": number, "activities": number, "transport": number },
      "similar_destinations": ["string", "string", "string"],
      "quick_facts": {
        "currency": "string",
        "languages": "string",
        "timezone": "string",
        "visa": "string"
      }
    }
    // ...exactly 10 items total, sorted by fit_score desc
  ],
  "budget_stretch_advisor": {
    "recommended_increase": "e.g., '+15–25% per person' or '+₹X per person'",
    "why_it_matters": "1 sentence benefit summary",
    "upgrades": [
      {
        "title": "string (e.g., Overnight cruise at Halong Bay)",
        "extra_cost_per_person": "approx number + currency_code",
        "what_you_get": "≤20 words, concrete value add"
      }
      // 3–5 items
    ]
  },
  "budget_cut_optimizer": {
    "target_savings": "e.g., 'save 10–25% per person'",
    "principle": "1 sentence on how savings are achieved without killing the experience",
    "swaps": [
      {
        "replace": "what to swap out",
        "with": "the lower-cost alternative",
        "savings_per_person": "approx number + currency_code",
        "impact_on_experience": "≤15 words, honest tradeoff"
      }
      // 3–5 items
    ]
  }
}

CONSISTENCY RULES
- Return EXACTLY 15 items in top_places (or fewer ONLY if truly impossible; then explain in meta.assumptions.notes).
- Keep text crisp and scannable; avoid long paragraphs.
- No hotels or booking links; focus on places/experiences.
- Prefer a mix of famed highlights and 20–30% hidden gems.
- Safety first: avoid recommending unsafe/illegal activities.

VALIDATION
- Ensure suggestions are doable within DAYS and make sense for NUM_PEOPLE.
- Costs must align with PRICE_RANGE (budget/mid/luxury) and local norms.
- If LOCATION granularity is ambiguous, choose the most user-helpful scope and note it in meta.location_scope.

OUTPUT STRICTNESS
- Output only JSON per the schema above. No markdown, no commentary, no trailing commas.
`;

    // Get places from Gemini
    const geminiObj = await getGeminiRecommendations(prompt);

    // Get images from Pixabay for each place
    const placesWithImages = await Promise.all(
      (geminiObj.top_places || []).map(async (place) => ({
        ...place,
        image: await fetchPixabayImages(
          place.image_search_query || place.name,
          3
        ).then((images) => images[0]), // get the first image from array
      }))
    );

    // Compose response
    const result = {
      ...geminiObj,
      top_places: placesWithImages,
    };

    res.json(result);
  } catch (err) {
    console.error("Error in getRecommendations:", err);

    let errorMessage = err.message || "Unknown error";
    if (err.response && err.response.data) {
      errorMessage += " | Gemini says: " + JSON.stringify(err.response.data);
    }

    res.status(500).json({ error: errorMessage });
  }
};

const getItinerary = async (req, res) => {
  try {
    const preferences = req.body.preferences;

     const prompt = `
You are Nexa, an expert AI travel planner.

GOAL
Generate a **day-by-day, hour-by-hour travel itinerary** for the given inputs. 
Make it feel like a personalized guide from a local expert.

USER INPUTS
- LOCATION: ${preferences.location}
- NUM_PEOPLE: ${preferences.numPeople}
- PRICE_RANGE: ${preferences.budget}
- DAYS: ${preferences.days}


STRUCTURE & RULES
- Break the plan into "Day 1, Day 2, …".
- For each day include:
  {
    "day": number,
    "theme": "string (e.g. 'Romantic Parisian Evening' or 'Adventure in the Alps')",
    "activities": [
      {
        "time": "Morning|Afternoon|Evening|Night",
        "title": "Activity name",
        "description": "≤25 words, vivid and concise",
        "category": "sightseeing|food|adventure|culture|relaxation|shopping|nightlife",
        "est_cost_per_person": { "min": number, "max": number },
        "duration": "hours or 'flexible'",
        "image_search_query": "succinct query for this activity (e.g., 'Eiffel Tower sunset picnic')",
        "map_hint": "spot, district, or landmark name"
      }
      // 3–6 activities per day
    ]
  }

BUDGET & CONSISTENCY
- Respect PRICE_RANGE as comfort tier (budget = affordable, mid = boutique, luxury = premium).
- Ensure all activities are feasible within DAYS and NUM_PEOPLE.
- Avoid unsafe/illegal suggestions.
- Balance icons: include mix of famed highlights + hidden gems.
- Add local food or cultural stops naturally.
- No hotels or booking links.

OUTPUT FORMAT (MANDATORY)
Respond with ONLY valid JSON.
Do NOT add explanations, greetings, or text outside JSON.
Start directly with "[" and end with "]".

CRITICAL: You MUST return a JSON array containing day objects. Do NOT return a single object or any other format.

EXAMPLE OUTPUT FORMAT:
[
  {
    "day": 1,
    "theme": "Welcome to Your Destination",
    "activities": [
      {
        "time": "Morning",
        "title": "Activity name",
        "description": "Description here",
        "category": "sightseeing",
        "est_cost_per_person": { "min": 10, "max": 50 },
        "duration": "2 hours",
        "image_search_query": "search query for this activity",
        "map_hint": "location name"
      }
    ]
  }
]
    `;

    // Get itinerary from Gemini (now always array)
    const geminiObj = await getGeminiRecommendations(prompt);

    // Fetch images for each activity
    const daysWithImages = await Promise.all(
      geminiObj.map(async (day) => ({
        ...day,
        activities: await Promise.all(
          (day.activities || []).map(async (act) => ({
            ...act,
            image: await fetchPixabayImages(
              act.image_search_query || act.title,
              3
            ).then((images) => images[0]),
          }))
        ),
      }))
    );

    res.json(daysWithImages);
  } catch (err) {
    console.error("Error in getItinerary:", err);

    let errorMessage = err.message || "Unknown error";
    if (err.response && err.response.data) {
      errorMessage += " | Gemini says: " + JSON.stringify(err.response.data);
    }

    res.status(500).json({ error: errorMessage });
  }
};


export { getRecommendations , getItinerary};
