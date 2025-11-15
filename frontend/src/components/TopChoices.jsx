import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Card from "./Card.jsx";
import { setItinerary } from "../slices/itinerarySlice.js";
import { setLastFetchedKey } from "../slices/preferencesSlice.js";
import { generatePreferenceKey, shouldFetchData } from "../utils/cacheUtils.js"; 
import { motion } from "framer-motion";

const API_BASE = "https://nexa-5.onrender.com";

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

  // Use ref to track if we've already processed the current preferences
  const processedPrefKeyRef = React.useRef(null);
  
  // Helper function to fetch itinerary (only when needed)
  const fetchItineraryIfNeeded = React.useCallback(async () => {
    if (!preferences.location || !recommendation) return;
    
    const currentKey = generatePreferenceKey(preferences);
    
    // Skip if we've already processed these exact preferences
    if (processedPrefKeyRef.current === currentKey) {
      console.log("Skipping itinerary API call - already processed these preferences");
      return;
    }
    
    // Use utility function to check if we should fetch
    if (!shouldFetchData(preferences, allItineraries)) {
      console.log("Skipping itinerary API call - data already cached or preferences unchanged");
      // Mark as processed even if we're not fetching
      processedPrefKeyRef.current = currentKey;
      return;
    }
    
    try {
      console.log("Fetching new itinerary for preferences:", preferences);
      const response = await fetch(`${API_BASE}/api/v1/recommendations/itinerary`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences })
      });
      
      if (response.ok) {
        const itineraryData = await response.json();
        console.log("New itinerary data received:", itineraryData);
        
        // Store itinerary and update last fetched key
        dispatch(setItinerary({ key: currentKey, data: itineraryData }));
        dispatch(setLastFetchedKey(currentKey));
        processedPrefKeyRef.current = currentKey;
        console.log("Itinerary cached and fetch key updated");
      } else {
        console.error("Failed to fetch itinerary:", response.status, response.statusText);
      }
    } catch (err) {
      console.error("Failed to fetch itinerary:", err);
    }
  }, [preferences, recommendation, allItineraries, dispatch]);

  // Only fetch itinerary when truly needed - use a more stable check
  React.useEffect(() => {
    const currentKey = generatePreferenceKey(preferences);
    
    // Reset processed key if preferences actually changed
    if (processedPrefKeyRef.current !== currentKey && currentKey) {
      processedPrefKeyRef.current = null;
    }
    
    // Only proceed if we have valid preferences and recommendation
    if (!preferences.location || !recommendation || !currentKey) {
      return;
    }
    
    // Check if we should fetch - this will be false if data exists or preferences unchanged
    if (shouldFetchData(preferences, allItineraries)) {
      // Fetch immediately in the background so itinerary is ready when user opens the page
      fetchItineraryIfNeeded();
    } else {
      // Mark as processed if we're not fetching
      processedPrefKeyRef.current = currentKey;
    }
  }, [preferences.location, preferences.days, preferences.numPeople, preferences.budget, recommendation, allItineraries, fetchItineraryIfNeeded]);

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
      <motion.div
        className="w-full min-h-screen flex flex-col items-center justify-center text-center bg-white py-16 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.12, delayChildren: 0.18 }}
      >
        <motion.p
          className="text-lg md:text-xl text-neutral-700"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 90 }}
        >
          No recommendations found.
        </motion.p>
        <motion.p
          className="text-sm text-neutral-500 mt-2 mb-4"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 90, delay: 0.05 }}
        >
          Available keys: {Object.keys(allRecommendations).length > 0 ? Object.keys(allRecommendations).slice(0, 3).join(", ") : "None"}
        </motion.p>
        <motion.button
          onClick={() => navigate("/home")}
          className="mt-6 px-6 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-orange-600 to-yellow-500 shadow-xl"
          whileHover={{ scale: 1.06, y: -3 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, type: "spring", stiffness: 120 }}
        >
          Go Back to Search
        </motion.button>
      </motion.div>
    );
  }

  const userLocation = preferences.location || "Your Destination";
  function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <motion.div
      className="w-full min-h-screen bg-gradient-to-b from-white to-neutral-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.12, delayChildren: 0.18 }}
    >
      <div className="flex flex-col items-center gap-16 pt-10 pb-24 px-4 sm:px-6">
        <motion.section
          className="w-full max-w-5xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 90 }}
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 mb-2"
            style={{ fontFamily: '"Inter", sans-serif' }}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 90 }}
          >
            In <span className="bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent">{capitalize(userLocation)}</span>
          </motion.h2>
          <motion.h3
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-800 mb-10"
            style={{ fontFamily: '"Inter", sans-serif' }}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 90, delay: 0.06 }}
          >
            Top Choices for Your Trip
          </motion.h3>
          <div className="w-full flex flex-col items-center gap-10 sm:gap-12">
            {recommendation.top_places.map((place) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
                whileHover={{ y: -6 }}
                className="w-full"
              >
                <Card place={place} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Budget Stretch Upgrades Card */}
        {recommendation.budget_stretch_advisor && (
          <motion.section
            className="bg-white/70 backdrop-blur-xl border border-pink-500/20 rounded-2xl shadow-xl mx-auto mt-10 max-w-[480px] w-full p-6 flex flex-col gap-4"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-pink-600 text-xl">🌟</span>
              <h3 className="font-bold text-lg sm:text-xl text-neutral-900">Budget Stretch Upgrades</h3>
            </div>
            <div className="text-sm text-neutral-700 mb-2">
              <span className="text-pink-400 font-semibold">
                {recommendation.budget_stretch_advisor.recommended_increase}
              </span>
              <span> &middot; {recommendation.budget_stretch_advisor.why_it_matters}</span>
            </div>
            <div className="flex flex-col gap-3">
              {(recommendation.budget_stretch_advisor.upgrades || []).map((upg) => (
                <motion.div
                  key={upg.title}
                  className="bg-white/70 backdrop-blur-md border border-pink-300/30 rounded-xl shadow p-4 flex flex-col gap-1"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
                  whileHover={{ y: -6 }}
                >
                  <div className="font-semibold text-pink-600 text-base">
                    ✚ {upg.title}
                  </div>
                  <div className="text-amber-600 font-medium">{upg.extra_cost_per_person}</div>
                  <div className="text-xs text-neutral-600">{upg.what_you_get}</div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Budget Cut Optimizer Card */}
        {recommendation.budget_cut_optimizer && (
          <motion.section
            className="bg-white/70 backdrop-blur-xl border border-green-500/20 rounded-2xl shadow-xl mx-auto mt-8 max-w-[480px] w-full p-6 flex flex-col gap-4"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-600 text-xl">✂️</span>
              <h3 className="font-bold text-lg sm:text-xl text-neutral-900">Budget Cut Optimizer</h3>
            </div>
            <div className="text-sm text-neutral-700 mb-2">
              <span className="text-green-400 font-semibold">
                {recommendation.budget_cut_optimizer.target_savings}
              </span>
              <span> &middot; {recommendation.budget_cut_optimizer.principle}</span>
            </div>
            <div className="flex flex-col gap-3">
              {(recommendation.budget_cut_optimizer.swaps || []).map((swap, i) => (
                <motion.div
                  key={swap.replace + swap.with + i}
                  className="bg-white/70 backdrop-blur-md border border-green-300/30 rounded-xl shadow p-4 flex flex-col gap-1"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
                  whileHover={{ y: -6 }}
                >
                  <div className="text-xs">
                    <span className="line-through text-red-500 mr-2">{swap.replace}</span>
                    <span className="text-green-600 mx-1">→ {swap.with}</span>
                    <span className="text-amber-600">{swap.savings_per_person}</span>
                  </div>
                  <div className="text-xs text-neutral-600">{swap.impact_on_experience}</div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Generate Itinerary Button */}
        <section className="w-full flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-8 sm:mt-12 px-4">
          <motion.button
            onClick={() => navigate("/home/itinerary")}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-600 to-yellow-500 text-white font-bold rounded-2xl shadow-2xl text-base sm:text-lg"
            whileHover={{ scale: 1.06, y: -3 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12, type: "spring", stiffness: 120 }}
          >
            🗺️ Generate Your Itinerary
          </motion.button>
          
          {/* Force refresh button - only show in development */}
          {process.env.NODE_ENV === 'development' && (
            <motion.button
              onClick={() => {
                // Clear cached data and force refetch
                dispatch(setLastFetchedKey(null));
                fetchItineraryIfNeeded();
              }}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-4 bg-gradient-to-r from-neutral-900 to-neutral-700 text-white font-bold rounded-2xl shadow-2xl text-sm sm:text-base"
              whileHover={{ scale: 1.06, y: -3 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16, type: "spring", stiffness: 120 }}
            >
              🔄 Force Refresh
            </motion.button>
          )}
        </section>
      </div>
    </motion.div>
  );
}

export default TopChoices;
