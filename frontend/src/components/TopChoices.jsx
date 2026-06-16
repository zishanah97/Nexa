import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Card from "./Card.jsx";
import { setItinerary } from "../slices/itinerarySlice.js";
import { setLastFetchedKey } from "../slices/preferencesSlice.js";
import { generatePreferenceKey, shouldFetchData } from "../utils/cacheUtils.js";
import { motion, useScroll, useTransform } from "framer-motion";

const API_BASE = "https://nexa-9la3.onrender.com";

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

  // Scroll-based motion for background and heading
  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const headingScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.9]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.65]);

  React.useEffect(() => {
    if (!preferences.location) {
      navigate("/home");
    }
  }, [preferences, navigate]);

  // Use ref to track if we've already processed the current preferences
  const processedPrefKeyRef = React.useRef(null);



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

    // Skip if we've already processed these exact preferences
    if (processedPrefKeyRef.current === currentKey) {
      console.log("Skipping itinerary API call - already processed these preferences");
      return;
    }

    // Use utility function to check if we should fetch
    if (!shouldFetchData(preferences, allItineraries)) {
      console.log("Skipping itinerary API call - data already cached or preferences unchanged");
      processedPrefKeyRef.current = currentKey;
      return;
    }

    // Fetch the itinerary
    const fetchItinerary = async () => {
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
    };

    // Fetch immediately in the background so itinerary is ready when user opens the page
    fetchItinerary();
  }, [preferences.location, preferences.days, preferences.numPeople, preferences.budget, recommendation, allItineraries, dispatch]);

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

  const totalPlaces = recommendation?.top_places?.length || 0;

  // Robust labels in case values are strings like "Two Days" or "Couple"
  const rawDays = preferences.days;
  let daysLabel = null;
  if (rawDays !== undefined && rawDays !== null && rawDays !== "") {
    if (typeof rawDays === "number") {
      daysLabel = `${rawDays} day${rawDays > 1 ? "s" : ""}`;
    } else {
      const numeric = Number(rawDays);
      if (!Number.isNaN(numeric)) {
        daysLabel = `${numeric} day${numeric > 1 ? "s" : ""}`;
      } else {
        daysLabel = rawDays;
      }
    }
  }

  const rawPeople = preferences.numPeople;
  let peopleLabel = null;
  if (rawPeople !== undefined && rawPeople !== null && rawPeople !== "") {
    if (typeof rawPeople === "number") {
      peopleLabel = `${rawPeople} traveler${rawPeople > 1 ? "s" : ""}`;
    } else {
      const numeric = Number(rawPeople);
      if (!Number.isNaN(numeric)) {
        peopleLabel = `${numeric} traveler${numeric > 1 ? "s" : ""}`;
      } else {
        peopleLabel = rawPeople;
      }
    }
  }

  const metaParts = [];
  if (totalPlaces) {
    metaParts.push(`${totalPlaces} curated place${totalPlaces > 1 ? "s" : ""}`);
  }
  if (daysLabel) {
    metaParts.push(daysLabel);
  }
  if (peopleLabel) {
    metaParts.push(peopleLabel);
  }

  return (
    <motion.div
      className="w-full min-h-screen inset-0 bg-gradient-to-b from-[#FAFAFA] to-white relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.12, delayChildren: 0.18 }}
    >
      <div className="w-full relative">

        <motion.div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
      `,
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 0 0",
            maskImage: `
        repeating-linear-gradient(
          to right,
          black 0px,
          black 3px,
          transparent 3px,
          transparent 8px
        ),
        repeating-linear-gradient(
          to bottom,
          black 0px,
          black 3px,
          transparent 3px,
          transparent 8px
        )
      `,
            WebkitMaskImage: `
        repeating-linear-gradient(
          to right,
          black 0px,
          black 3px,
          transparent 3px,
          transparent 8px
        ),
        repeating-linear-gradient(
          to bottom,
          black 0px,
          black 3px,
          transparent 3px,
          transparent 8px
        )
      `,
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
        />
        <div className="flex flex-col items-center gap-12 pt-8 pb-24 px-6 sm:px-8 relative">
          <motion.section
            className="w-full max-w-6xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 90 }}
          >
            {/* Header with subtle accent */}
            <div className="mb-10 max-w-4xl mx-auto text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                <span
                  className="text-[11px] font-semibold tracking-[0.08em] uppercase text-neutral-600"
                  style={{ fontFamily: '"Inter", sans-serif' }}
                >
                  Top choices
                </span>
              </div>
              <motion.h2
                className="text-3xl sm:text-4xl md:text-5xl font-semibold md:font-bold tracking-tight text-neutral-900 mb-3"
                style={{ fontFamily: '"Playfair Display", "Inter", serif', letterSpacing: "-0.02em", scale: headingScale, opacity: headingOpacity }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, type: "spring", stiffness: 90 }}
              >
                Top choices in {capitalize(userLocation)}
              </motion.h2>
              {metaParts.length > 0 && (
                <motion.p
                  className="text-xs sm:text-[13px] text-neutral-500 mb-1"
                  style={{ fontFamily: '"Inter", sans-serif' }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.08 }}
                >
                  {metaParts.join(" · ")}
                </motion.p>
              )}
              <motion.p
                className="text-base sm:text-lg text-neutral-600 max-w-2xl"
                style={{ fontFamily: '"Inter", sans-serif' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                Curated places that match your days, budget, and travel style.
              </motion.p>
            </div>
            <div className="w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-6 sm:gap-8">
              {recommendation.top_places.map((place, idx) => (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, y: 40, x: idx % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.7, delay: idx * 0.08, ease: "easeOut" }}
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
              className="bg-white/95 border border-neutral-200 rounded-2xl shadow-[0_14px_35px_rgba(15,23,42,0.08)] mx-auto mt-8 max-w-[520px] w-full p-6 flex flex-col gap-4"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <h3 className="text-xs font-medium tracking-[0.16em] uppercase text-neutral-500">
                  Budget stretch upgrades
                </h3>
              </div>
              <div className="text-sm text-neutral-700 mb-2">
                <span className="font-semibold">
                  {recommendation.budget_stretch_advisor.recommended_increase}
                </span>
                <span> &middot; {recommendation.budget_stretch_advisor.why_it_matters}</span>
              </div>
              <div className="flex flex-col gap-3">
                {(recommendation.budget_stretch_advisor.upgrades || []).map((upg) => (
                  <motion.div
                    key={upg.title}
                    className="bg-neutral-50 border border-neutral-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col gap-1"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
                    whileHover={{ y: -6 }}
                  >
                    <div className="font-semibold text-neutral-900 text-sm">
                      {upg.title}
                    </div>
                    <div className="text-sm font-medium text-neutral-700">{upg.extra_cost_per_person}</div>
                    <div className="text-xs text-neutral-600">{upg.what_you_get}</div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Budget Cut Optimizer Card */}
          {recommendation.budget_cut_optimizer && (
            <motion.section
              className="bg-white/95 border border-neutral-200 rounded-2xl shadow-[0_14px_35px_rgba(15,23,42,0.08)] mx-auto mt-6 max-w-[520px] w-full p-6 flex flex-col gap-4"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                <h3 className="text-xs font-medium tracking-[0.16em] uppercase text-neutral-500">
                  Budget cut optimizer
                </h3>
              </div>
              <div className="text-sm text-neutral-700 mb-2">
                <span className="font-semibold">
                  {recommendation.budget_cut_optimizer.target_savings}
                </span>
                <span> &middot; {recommendation.budget_cut_optimizer.principle}</span>
              </div>
              <div className="flex flex-col gap-3">
                {(recommendation.budget_cut_optimizer.swaps || []).map((swap, i) => (
                  <motion.div
                    key={swap.replace + swap.with + i}
                    className="bg-neutral-50 border border-neutral-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col gap-1"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
                    whileHover={{ y: -6 }}
                  >
                    <div className="text-xs">
                      <span className="line-through text-red-500 mr-2">{swap.replace}</span>
                      <span className="text-green-600 mx-1">→ {swap.with}</span>
                      <span className="text-neutral-700">{swap.savings_per_person}</span>
                    </div>
                    <div className="text-xs text-neutral-600">{swap.impact_on_experience}</div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Generate Itinerary Button */}
          <section className="w-full flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-10 px-4">
            <motion.button
              onClick={() => navigate("/home/itinerary")}
              className="w-full sm:w-auto px-7 sm:px-9 py-3.5 sm:py-4 bg-neutral-900 text-white font-medium rounded-xl shadow-[0_14px_35px_rgba(15,23,42,0.35)] hover:shadow-[0_18px_45px_rgba(15,23,42,0.45)] text-sm sm:text-base transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12, type: "spring", stiffness: 120 }}
            >
              <span className="flex items-center justify-center gap-2">
                <span>View full itinerary</span>
                <span>→</span>
              </span>
            </motion.button>

            {/* Force refresh button - only show in development */}
            {process.env.NODE_ENV === 'development' && (
              <motion.button
                onClick={() => {
                  // Clear cached data and force refetch
                  dispatch(setLastFetchedKey(null));
                  processedPrefKeyRef.current = null;
                  // The useEffect will trigger automatically on next render
                }}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-4 bg-gradient-to-r from-neutral-900 to-neutral-700 text-white font-bold rounded-2xl shadow-2xl text-sm sm:text-base cursor-pointer"
                whileHover={{ scale: 1.06, y: -3 }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.16, type: "spring", stiffness: 120 }}
              >
                🔄 Force Refresh
              </motion.button>
            )}
          </section>
        </div>
      </div>



    </motion.div>
  );
}

export default TopChoices;
