import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Card from "./Card.jsx";
import { setItinerary } from "../slices/itinerarySlice.js"; 

function TopChoices() {
  const locationRouter = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const preferences = useSelector(state => state.preferences);
  const allRecommendations = useSelector(state => state.recommendation.recommendations);
  const allItineraries = useSelector(state => state.itinerary.itineraries);
  
  // Try to get prefKey from location state first, then from preferences
  const prefKeyFromState = locationRouter.state?.prefKey;
  const prefKeyFromPrefs = JSON.stringify(preferences);
  
  // Find the best matching recommendation key
  const findBestRecommendationKey = () => {
    // First try the exact key from location state
    if (prefKeyFromState && allRecommendations[prefKeyFromState]) {
      return prefKeyFromState;
    }
    
    // Then try the current preferences key
    if (allRecommendations[prefKeyFromPrefs]) {
      return prefKeyFromPrefs;
    }
    
    // Finally, try to find any key that matches current preferences
    const currentPrefs = preferences.location && preferences.days && preferences.numPeople && preferences.budget;
    if (currentPrefs) {
      for (const key in allRecommendations) {
        try {
          const storedPrefs = JSON.parse(key);
          if (storedPrefs.location === preferences.location && 
              storedPrefs.days === preferences.days &&
              storedPrefs.numPeople === preferences.numPeople &&
              storedPrefs.budget === preferences.budget) {
            return key;
          }
        } catch (e) {
          // Skip invalid JSON keys
        }
      }
    }
    
    return null;
  };

  const prefKey = findBestRecommendationKey();
  const recommendation = prefKey ? allRecommendations[prefKey] : null;

  React.useEffect(() => {
    if (!preferences.location) {
      navigate("/home");
    }
  }, [preferences, navigate]);

  // Fetch itinerary after recommendations are loaded
  React.useEffect(() => {
    if (preferences.location && recommendation) {
      // Check if itinerary already exists
      const itineraryKey = JSON.stringify(preferences);
      const existingItinerary = allItineraries[itineraryKey];
      
      if (existingItinerary) {
        console.log("Itinerary already exists for these preferences:", existingItinerary);
        return;
      }
      
      // Add a small delay to ensure recommendations are fully processed
      setTimeout(() => {
        const fetchItinerary = async () => {
        try {
          console.log("Fetching itinerary for preferences:", preferences);
          const response = await fetch('http:///nexa-5.onrender.com/api/v1/recommendations/itinerary', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ preferences })
          });
          
          if (response.ok) {
            const itineraryData = await response.json();
            console.log("Itinerary data received:", itineraryData);
            // Store itinerary with a key based on preferences
            const itineraryKey = JSON.stringify(preferences);
            console.log("Storing itinerary with key:", itineraryKey);
            dispatch(setItinerary({ key: itineraryKey, data: itineraryData }));
            console.log("Itinerary dispatched to Redux");
          } else {
            console.error("Failed to fetch itinerary:", response.status, response.statusText);
            const errorText = await response.text();
            console.error("Error response:", errorText);
          }
        } catch (err) {
          console.error("Failed to fetch itinerary:", err);
        }
      };
      fetchItinerary();
        }, 1000); // 1 second delay
    }
  }, [preferences, recommendation, allItineraries, dispatch]);

  // Debug logging to help troubleshoot
  React.useEffect(() => {
    console.log("TopChoices Debug:", {
      preferences,
      prefKeyFromState,
      prefKeyFromPrefs,
      foundPrefKey: prefKey,
      allRecommendations: Object.keys(allRecommendations),
      allItineraries: Object.keys(allItineraries),
      recommendation: !!recommendation
    });
  }, [preferences, prefKeyFromState, prefKeyFromPrefs, prefKey, allRecommendations, allItineraries, recommendation]);

  if (!recommendation) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center text-center text-gray-300 bg-black py-16 px-6">
        <p className="text-lg md:text-xl">No recommendations found.</p>
        <p className="text-sm text-gray-500 mt-2 mb-4">
          Available keys: {Object.keys(allRecommendations).length > 0 ? Object.keys(allRecommendations).slice(0, 3).join(", ") : "None"}
        </p>
        <button
          onClick={() => navigate("/home")}
          className="mt-6 px-5 py-3 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 text-white font-medium rounded-xl shadow-lg hover:scale-105 transition"
        >
          Go Back to Search
        </button>
      </div>
    );
  }

  const userLocation = preferences.location || "Your Destination";
  function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <div className="w-full min-h-screen bg-black">
      <div className="flex flex-col items-center gap-16 pt-8 pb-20 px-1 sm:px-5">
        <section className="w-full">
          <h2
            className="font-extrabold bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 bg-clip-text text-transparent sm:text-3xl md:text-4xl tracking-tight drop-shadow-md mb-2 ml-4 text-3xl"
            style={{
              fontFamily: "'Stardos Stencil', 'Inter', sans-serif",
              fontWeight: 700
            }}
          >
            <span className="text-white">In</span> {capitalize(userLocation)}
          </h2>
          <h2
            className="text-3xl font-extrabold bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 bg-clip-text text-transparent sm:text-3xl md:text-4xl mb-13 tracking-tight drop-shadow-md  ml-4"
            style={{
              fontFamily: "'Stardos Stencil', 'Inter', sans-serif",
              fontWeight: 700
            }}
          >
            <span className="text-3xl text-white"> Top Choices for </span> Your Trip
          </h2>

          <div className="w-full flex flex-col items-center gap-16 px-5">
            {recommendation.top_places.map((place) => (
              <Card key={place.id} place={place} />
            ))}
          </div>
        </section>

        {/* Budget Stretch Upgrades Card */}
        {recommendation.budget_stretch_advisor && (
          <section className="bg-neutral-900 border border-purple-600/20 rounded-2xl shadow-xl mx-auto mt-10 max-w-[420px] w-full p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-pink-400 text-xl">🌟</span>
              <h3 className="font-bold text-lg sm:text-xl text-white drop-shadow">Budget Stretch Upgrades</h3>
            </div>
            <div className="text-sm text-gray-300 mb-2">
              <span className="text-pink-400 font-semibold">
                {recommendation.budget_stretch_advisor.recommended_increase}
              </span>
              <span> &middot; {recommendation.budget_stretch_advisor.why_it_matters}</span>
            </div>
            <div className="flex flex-col gap-3">
              {(recommendation.budget_stretch_advisor.upgrades || []).map((upg) => (
                <div
                  key={upg.title}
                  className="bg-black/60 border border-pink-300/20 rounded-xl shadow p-4 flex flex-col gap-1"
                >
                  <div className="font-semibold text-pink-200 text-base">
                    ✚ {upg.title}
                  </div>
                  <div className="text-yellow-400 font-medium">{upg.extra_cost_per_person}</div>
                  <div className="text-xs text-gray-400">{upg.what_you_get}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Budget Cut Optimizer Card */}
        {recommendation.budget_cut_optimizer && (
          <section className="bg-neutral-900 border border-green-500/20 rounded-2xl shadow-xl mx-auto mt-8 max-w-[420px] w-full p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-400 text-xl">✂️</span>
              <h3 className="font-bold text-lg sm:text-xl text-white drop-shadow">Budget Cut Optimizer</h3>
            </div>
            <div className="text-sm text-gray-300 mb-2">
              <span className="text-green-400 font-semibold">
                {recommendation.budget_cut_optimizer.target_savings}
              </span>
              <span> &middot; {recommendation.budget_cut_optimizer.principle}</span>
            </div>
            <div className="flex flex-col gap-3">
              {(recommendation.budget_cut_optimizer.swaps || []).map((swap, i) => (
                <div
                  key={swap.replace + swap.with + i}
                  className="bg-black/60 border border-green-300/20 rounded-xl shadow p-4 flex flex-col gap-1"
                >
                  <div className="text-xs">
                    <span className="line-through text-red-300 mr-2">{swap.replace}</span>
                    <span className="text-green-300 mx-1">→ {swap.with}</span>
                    <span className="text-yellow-300">{swap.savings_per_person}</span>
                  </div>
                  <div className="text-xs text-gray-400">{swap.impact_on_experience}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Generate Itinerary Button */}
        <section className="w-full flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-8 sm:mt-12 px-4">
          <button
            onClick={() => navigate("/home/itinerary")}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/25 hover:scale-105 transition-all duration-300 text-base sm:text-lg"
          >
            🗺️ Generate Your Itinerary
          </button>
          
          {/* Debug button to manually trigger itinerary generation */}
          <button
            onClick={async () => {
              try {
                console.log("Manually triggering itinerary generation for:", preferences);
                const response = await fetch('https://nexa-5.onrender.com/api/v1/recommendations/itinerary', {
                  method: 'POST',
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ preferences })
                });
                
                if (response.ok) {
                  const itineraryData = await response.json();
                  console.log("Manual itinerary data received:", itineraryData);
                  const itineraryKey = JSON.stringify(preferences);
                  dispatch(setItinerary({ key: itineraryKey, data: itineraryData }));
                  console.log("Manual itinerary dispatched to Redux");
                } else {
                  console.error("Manual itinerary fetch failed:", response.status);
                }
              } catch (err) {
                console.error("Manual itinerary fetch error:", err);
              }
            }}
            className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/25 hover:scale-105 transition-all duration-300 text-sm sm:text-base"
          >
            🧪 Debug: Generate Itinerary
          </button>
          
          {/* Test Redux action directly */}
          <button
            onClick={() => {
              const testData = [{ day: 1, theme: "Test Day", activities: [] }];
              const testKey = JSON.stringify(preferences);
              console.log("Testing Redux action directly with:", { key: testKey, data: testData });
              dispatch(setItinerary({ key: testKey, data: testData }));
            }}
            className="w-full sm:w-auto px-4 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/25 hover:scale-105 transition-all duration-300 text-sm sm:text-base"
          >
            🔴 Test Redux Action
          </button>
          
          {/* Check localStorage */}
          <button
            onClick={() => {
              console.log("Checking localStorage:");
              const keys = Object.keys(localStorage);
              keys.forEach(key => {
                if (key.includes('itinerary') || key.includes('persist')) {
                  try {
                    const value = JSON.parse(localStorage.getItem(key));
                    console.log(key, value);
                  } catch (e) {
                    console.log(key, localStorage.getItem(key));
                  }
                }
              });
            }}
            className="w-full sm:w-auto px-4 py-3 sm:py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/25 hover:scale-105 transition-all duration-300 text-sm sm:text-base"
          >
            📦 Check localStorage
          </button>
        </section>
      </div>
    </div>
  );
}

export default TopChoices;
