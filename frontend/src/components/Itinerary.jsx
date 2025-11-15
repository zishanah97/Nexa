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

  // Generate current key based on active preferences
  const currentKey = generatePreferenceKey(preferences);
  const itinerary = currentKey ? allItineraries[currentKey] : null;

  React.useEffect(() => {
    if (!preferences.location || !currentKey || itinerary) return;

    const fetchItinerary = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE}/api/v1/recommendations/itinerary`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ preferences }),
        });

        if (response.ok) {
          const data = await response.json();
          dispatch(setItinerary({ key: currentKey, data }));
        } else {
          setError("Failed to generate itinerary. Please try again.");
        }
      } catch (e) {
        setError("Failed to generate itinerary. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [preferences, currentKey, itinerary, dispatch]);

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
      className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-neutral-50 text-neutral-900 px-3 sm:px-4 pb-10 pt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.12, delayChildren: 0.18 }}
    >
      {/* Page shell */}
      <div className="max-w-6xl mx-auto">
        {/* Sticky heading strip */}
        <motion.div
          className="backdrop-blur-xl bg-white/70 border border-orange-100 rounded-3xl shadow-lg px-4 sm:px-6 py-3 flex items-center justify-between gap-3 mb-6 sticky top-16 z-10"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 90 }}
        >
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-orange-500">
              Nexa · Smart Trip Blueprint
            </p>
            <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-neutral-900 leading-tight">
              Your
              <span className="bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent ml-1">
                Itinerary
              </span>
            </h1>
          </div>
          <div className="hidden sm:flex flex-col items-end text-xs text-neutral-500">
            <span>{preferences.days || "Multi"} day trip</span>
            <span>{preferences.location || "Your destination"}</span>
          </div>
        </motion.div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-8 lg:gap-10 items-start">
          {/* Days + activities timeline */}
          <div className="space-y-8">
            {itinerary.map((day, dayIndex) => (
              <motion.div
                key={dayIndex}
                className="bg-white rounded-3xl shadow-[0_18px_40px_rgba(15,23,42,0.08)] border border-orange-100/70 px-5 sm:px-6 py-5 sm:py-6 relative overflow-hidden"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dayIndex * 0.06, duration: 0.6, type: "spring", stiffness: 95 }}
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-orange-500 to-yellow-400 rounded-r-full opacity-80" />

                {/* Day header */}
                <div className="flex items-start gap-4 mb-5">
                  <div className="mt-0.5 flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/30">
                    {day.day || dayIndex + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold text-neutral-900 truncate">
                      {day.theme || `Day ${day.day || dayIndex + 1}`}
                    </h2>
                    {preferences.location && (
                      <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                        Around {preferences.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* Activities list */}
                <div className="space-y-4 sm:space-y-5">
                  {(day.activities || []).map((act, actIndex) => (
                    <div
                      key={actIndex}
                      className="rounded-2xl border border-neutral-100 bg-gradient-to-br from-neutral-50 to-white px-4 sm:px-5 py-3.5 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4"
                    >
                      <div className="text-[11px] sm:text-xs font-semibold text-orange-600 uppercase tracking-[0.18em] w-24 flex-shrink-0 pt-0.5">
                        {act.time || "Anytime"}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-neutral-900 text-sm sm:text-base">
                            {act.title || "Activity"}
                          </span>
                          {act.duration && (
                            <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] rounded-full bg-orange-100 text-orange-700 font-medium">
                              {act.duration}
                            </span>
                          )}
                          {act.category && (
                            <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] rounded-full bg-neutral-900 text-white font-medium">
                              {act.category}
                            </span>
                          )}
                        </div>
                        {act.description && (
                          <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
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
                        <div className="w-full sm:w-28 h-24 sm:h-24 rounded-2xl overflow-hidden border border-neutral-200/60 shadow-sm flex-shrink-0">
                          <img
                            src={act.image.imageUrl || act.image.largeImageUrl || act.image}
                            alt={act.title || "Activity image"}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right column: summary & actions */}
          <div className="space-y-5 lg:space-y-6">
            <div className="bg-white/80 backdrop-blur-xl border border-orange-100 rounded-3xl shadow-[0_20px_45px_rgba(15,23,42,0.09)] p-5 sm:p-6">
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
            </div>

            <div className="bg-white/90 backdrop-blur-xl border border-neutral-200 rounded-3xl shadow-[0_16px_40px_rgba(15,23,42,0.08)] p-4 sm:p-5 flex flex-col gap-3">
              <p className="text-xs sm:text-sm text-neutral-600">
                Tweak your preferences or clear this itinerary to explore a fresh plan.
              </p>
              <div className="flex flex-col sm:flex-row justify-center sm:justify-between gap-3">
                <button
                  onClick={() => navigate("/recommendations")}
                  className="px-5 py-2.5 bg-white border border-orange-300 text-orange-600 text-sm font-semibold rounded-full hover:bg-orange-50 transition shadow-sm flex-1"
                >
                  Edit Preferences
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("Clear this itinerary?")) {
                      dispatch(clearItinerary(currentKey));
                    }
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-semibold rounded-full hover:shadow-lg hover:-translate-y-px transition flex-1"
                >
                  Clear Itinerary
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  );
}