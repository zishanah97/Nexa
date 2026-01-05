import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { setItinerary, clearItinerary } from "../slices/itinerarySlice.js";
import { setPreferences } from "../slices/preferencesSlice.js";
import { generatePreferenceKey } from "../utils/cacheUtils.js";

const API_BASE = "https://nexa-5.onrender.com";

export default function Itinerary() {
  const preferences = useSelector((state) => state.preferences);
  const allItineraries = useSelector((state) => state.itinerary.itineraries);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [openDayIndex, setOpenDayIndex] = React.useState(0);

  // Track if we're currently fetching to prevent duplicate requests
  const fetchingRef = React.useRef(false);

  // Generate current key based on active preferences
  const currentKey = generatePreferenceKey(preferences);
  const itinerary = currentKey ? allItineraries[currentKey] : null;

  const userLocation = preferences.location || "Your destination";

  const rawDays = preferences.days;
  let daysLabel = null;
  if (rawDays !== undefined && rawDays !== null && rawDays !== "") {
    if (typeof rawDays === "number") {
      daysLabel = `${rawDays} day${rawDays > 1 ? "s" : ""}`;
    } else {
      const numericDays = Number(rawDays);
      if (!Number.isNaN(numericDays)) {
        daysLabel = `${numericDays} day${numericDays > 1 ? "s" : ""}`;
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
      const numericPeople = Number(rawPeople);
      if (!Number.isNaN(numericPeople)) {
        peopleLabel = `${numericPeople} traveler${numericPeople > 1 ? "s" : ""}`;
      } else {
        peopleLabel = rawPeople;
      }
    }
  }

  const metaParts = [];
  if (daysLabel) metaParts.push(daysLabel);
  if (peopleLabel) metaParts.push(peopleLabel);
  if (preferences.budget) metaParts.push(`${preferences.budget} budget`);

  React.useEffect(() => {
    // Don't fetch if already have data, no valid key, or currently fetching
    if (!preferences.location || !currentKey || itinerary || fetchingRef.current) return;

    const fetchItinerary = async () => {
      try {
        fetchingRef.current = true;
        setLoading(true);
        setError(null);
        console.log("Fetching itinerary for key:", currentKey);

        const response = await fetch(`${API_BASE}/api/v1/recommendations/itinerary`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ preferences }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Itinerary fetched successfully");
          dispatch(setItinerary({ key: currentKey, data }));
        } else {
          setError("Failed to generate itinerary. Please try again.");
        }
      } catch (e) {
        console.error("Itinerary fetch error:", e);
        setError("Failed to generate itinerary. Please check your connection.");
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    };

    fetchItinerary();
  }, [preferences.location, preferences.days, preferences.numPeople, preferences.budget, currentKey, itinerary, dispatch]);

  // SAFE: Check if we have a valid, non-empty array
  const hasValidItinerary =
    itinerary &&
    Array.isArray(itinerary) &&
    itinerary.length > 0;

  if (loading) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-neutral-50 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.12, delayChildren: 0.18 }}
      >
        <motion.div
          className="text-center max-w-md px-4"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 90 }}
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mb-4">
            Generating your itinerary...
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 mb-6">
            Please wait while we craft a day-by-day plan for your trip.
          </p>
        </motion.div>
      </motion.div>
    );
  }

  // === NO ITINERARY CASE ===
  if (!hasValidItinerary) {
    const hasAnySavedItineraries = Object.keys(allItineraries).length > 0;

    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-neutral-50 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.12, delayChildren: 0.18 }}
      >
        <motion.div
          className="text-center max-w-md px-4"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 90 }}
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mb-4">
            No Itinerary Yet
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 mb-6">
            {error
              ? error
              : hasAnySavedItineraries
                ? `No itinerary found for your current preferences.`
                : `You need to generate an itinerary first from your recommendations.`}
          </p>

          {/* Optional: Show helpful action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/recommendations")}
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-yellow-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Generate Itinerary
            </button>
            {hasAnySavedItineraries && (
              <button
                onClick={() => navigate("/saved")}
                className="px-6 py-3 bg-neutral-200 text-neutral-800 font-semibold rounded-full hover:bg-neutral-300 transition"
              >
                View Saved
              </button>
            )}
          </div>

          {/* DEVELOPMENT DEBUG INFO */}
          {process.env.NODE_ENV === "development" && (
            <details className="mt-8 p-4 bg-neutral-100 rounded-lg text-left text-xs font-mono">
              <summary className="cursor-pointer font-semibold text-neutral-700 mb-2">
                Debug Info (Dev Only)
              </summary>
              <pre className="overflow-auto max-h-64 p-2 bg-black text-green-400 rounded">
                {JSON.stringify(
                  {
                    currentKey,
                    hasAnySavedItineraries,
                    allItinerariesKeys: Object.keys(allItineraries),
                    currentItineraryRaw: allItineraries[currentKey],
                    preferencesSnapshot: preferences,
                  },
                  null,
                  2
                )}
              </pre>
            </details>
          )}
        </motion.div>
      </motion.div>
    );
  }

  // === ITINERARY EXISTS — RENDER IT ===
  return (
    <motion.main
      className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-neutral-50 text-neutral-900 px-4 sm:px-6 pb-10 pt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.12, delayChildren: 0.18 }}
    >
      {/* Page shell */}
      <div className="max-w-md md:max-w-6xl mx-auto">
        {/* Sticky heading strip */}
        <motion.div
          className="backdrop-blur-xl bg-white/80 border border-orange-100/80 rounded-3xl shadow-[0_18px_40px_rgba(15,23,42,0.08)] px-4 sm:px-7 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 relative z-10"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 90 }}
        >
          <div className="space-y-2">
            <p
              className="text-[11px] font-semibold tracking-[0.24em] uppercase text-orange-500"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              Nexa · Smart trip blueprint
            </p>
            <h1
              className="font-semibold tracking-tight text-neutral-900"
              style={{
                fontFamily: '"Playfair Display", "Inter", serif',
                letterSpacing: "-0.02em",
                fontSize: "clamp(1.6rem, 2vw + 0.95rem, 2.3rem)",
                lineHeight: 1.18,
              }}
            >
              Day-by-day plan for {userLocation}
            </h1>
            {metaParts.length > 0 && (
              <p
                className="text-[11px] sm:text-xs text-neutral-500 uppercase tracking-[0.22em]"
                style={{ fontFamily: '"Inter", sans-serif' }}
              >
                {metaParts.join(" · ")}
              </p>
            )}
          </div>
          <div className="hidden sm:flex flex-col items-end text-xs sm:text-sm text-neutral-500 sm:pt-1">
            <span className="font-medium text-neutral-800">
              {preferences.days || "Multi"}-day itinerary
            </span>
            <span>{preferences.location || "Your destination"}</span>
          </div>
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-start">
          {/* Days + activities timeline */}
          <div className="space-y-10 lg:col-span-7 xl:col-span-8">
            {itinerary.map((day, dayIndex) => {
              const isOpen = openDayIndex === dayIndex;

              return (
                <motion.div
                  key={dayIndex}
                  className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-[0_18px_40px_rgba(15,23,42,0.08)] border border-orange-100/70 px-6 sm:px-8 py-7 sm:py-8 relative overflow-hidden"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: dayIndex * 0.06, duration: 0.6, type: "spring", stiffness: 95 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-orange-500 to-yellow-400 rounded-r-full opacity-80" />

                  {/* Day header */}
                  <div
                    className="flex items-start gap-4 mb-5 cursor-pointer"
                    onClick={() => setOpenDayIndex(isOpen ? -1 : dayIndex)}
                  >
                    <div className="mt-0.5 flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/30">
                      {day.day || dayIndex + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2
                        className="font-semibold text-neutral-900 truncate"
                        style={{
                          fontFamily: '"Inter", sans-serif',
                          fontSize: "clamp(1.05rem, 1.3vw + 0.9rem, 1.35rem)",
                          lineHeight: 1.2,
                        }}
                      >
                        {day.theme || `Day ${day.day || dayIndex + 1}`}
                      </h2>
                      {preferences.location && (
                        <p
                          className="text-xs sm:text-sm text-neutral-500 mt-1"
                          style={{
                            fontFamily: '"Inter", sans-serif',
                            fontSize: "clamp(0.78rem, 1.8vw, 0.9rem)",
                            letterSpacing: "0.02em",
                          }}
                        >
                          Around {preferences.location}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Activities list */}
                  {isOpen && (
                    <div className="space-y-5 sm:space-y-6">
                      {(day.activities || []).map((act, actIndex) => (
                        <motion.div
                          key={actIndex}
                          className="rounded-2xl border border-neutral-100 bg-gradient-to-br from-neutral-50 to-white px-4 sm:px-5 py-5 sm:py-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.2 }}
                          transition={{ duration: 0.5, delay: actIndex * 0.05 }}
                          whileHover={{ y: -4, boxShadow: "0 18px 45px rgba(15,23,42,0.12)" }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <div className="text-[10px] sm:text-[11px] font-semibold text-orange-600 uppercase tracking-[0.24em] w-24 flex-shrink-0 pt-0.5">
                            {act.time || "Anytime"}
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-neutral-900 text-sm sm:text-base">
                                {act.title || "Activity"}
                              </span>
                              {act.duration && (
                                <motion.span
                                  className="inline-flex items-center px-2.5 py-0.5 text-[11px] rounded-full bg-orange-100 text-orange-700 font-medium"
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  whileInView={{ opacity: 1, scale: 1 }}
                                  viewport={{ once: true, amount: 0.3 }}
                                  transition={{ duration: 0.35, delay: actIndex * 0.05 + 0.05 }}
                                >
                                  {act.duration}
                                </motion.span>
                              )}
                              {act.category && (
                                <motion.span
                                  className="inline-flex items-center px-2.5 py-0.5 text-[11px] rounded-full bg-neutral-900 text-white font-medium"
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  whileInView={{ opacity: 1, scale: 1 }}
                                  viewport={{ once: true, amount: 0.3 }}
                                  transition={{ duration: 0.35, delay: actIndex * 0.05 + 0.08 }}
                                >
                                  {act.category}
                                </motion.span>
                              )}
                            </div>
                            {act.description && (
                              <p
                                className="text-xs sm:text-sm text-neutral-700 leading-relaxed"
                                style={{
                                  fontFamily: '\"Inter\", sans-serif',
                                  fontSize: "clamp(0.95rem, 2.4vw, 1.05rem)",
                                  color: "#444444",
                                }}
                              >
                                {act.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-3 items-center mt-1.5">
                              {act.est_cost_per_person && (
                                <p className="text-[11px] sm:text-xs text-neutral-500">
                                  Budget: {act.est_cost_per_person.min} - {act.est_cost_per_person.max} per person
                                </p>
                              )}
                              {act.map_hint && (
                                <p className="text-[11px] sm:text-xs text-neutral-500 flex items-center gap-1">
                                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  {act.map_hint}
                                </p>
                              )}
                            </div>
                          </div>

                          {act.image && (
                            <div className="w-full sm:w-32 aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-200/60 shadow-[0_10px_24px_rgba(15,23,42,0.12)] flex-shrink-0">
                              <img
                                src={act.image.imageUrl || act.image.largeImageUrl || act.image}
                                alt={act.title || "Activity image"}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Right column: summary & actions */}
          <div className="space-y-5 lg:space-y-6 lg:col-span-5 xl:col-span-4">
            <motion.div
              className="bg-white/80 backdrop-blur-xl border border-orange-100 rounded-3xl shadow-[0_20px_45px_rgba(15,23,42,0.09)] p-5 sm:p-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 95 }}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
            >
              <h3 className="text-sm font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                <span className="inline-flex w-6 h-6 rounded-full bg-orange-100 items-center justify-center text-xs text-orange-600 font-bold">
                  i
                </span>
                Trip Snapshot
              </h3>
              <div className="text-xs sm:text-sm text-neutral-600 space-y-1.5">
                <p>
                  <span className="font-medium text-neutral-900">Destination:</span>{" "}
                  {preferences.location || "Not set"}
                </p>
                <p>
                  <span className="font-medium text-neutral-900">Days:</span>{" "}
                  {preferences.days || "Flexible"}
                </p>
                <p>
                  <span className="font-medium text-neutral-900">Travelers:</span>{" "}
                  {preferences.numPeople || "Not specified"}
                </p>
                <p>
                  <span className="font-medium text-neutral-900">Budget:</span>{" "}
                  {preferences.budget || "Not specified"}
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-white/90 backdrop-blur-xl border border-neutral-200 rounded-3xl shadow-[0_16px_40px_rgba(15,23,42,0.08)] p-4 sm:p-5 flex flex-col gap-3"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18, type: "spring", stiffness: 95 }}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
            >
              <p className="text-xs sm:text-sm text-neutral-600">
                Tweak your preferences or clear this itinerary to explore a fresh plan.
              </p>
              <div className="flex flex-col sm:flex-row justify-center sm:justify-between gap-3">
                <motion.button
                  onClick={() => navigate("/recommendations")}
                  className="px-5 py-3 bg-white border border-orange-300 text-orange-600 text-sm font-semibold rounded-full hover:bg-orange-50 transition shadow-sm flex-1"
                  whileTap={{ scale: 0.96 }}
                >
                  Edit Preferences
                </motion.button>
                <motion.button
                  onClick={() => {
                    if (window.confirm("Clear this itinerary?")) {
                      dispatch(clearItinerary(currentKey));
                    }
                  }}
                  className="px-5 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-semibold rounded-full hover:shadow-lg hover:-translate-y-px transition flex-1"
                  whileTap={{ scale: 0.96 }}
                >
                  Clear Itinerary
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.main>
  );
}