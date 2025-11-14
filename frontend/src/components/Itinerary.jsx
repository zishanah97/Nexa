import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { setItinerary, clearItinerary } from "../slices/itinerarySlice.js";
import { setPreferences } from "../slices/preferencesSlice.js";

// ... (rest of the code remains the same)

export default function Itinerary() {
  const preferences = useSelector((state) => state.preferences);
  const allItineraries = useSelector((state) => state.itinerary.itineraries);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ... (rest of the code remains the same)

  if (!itinerary || itinerary.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-neutral-50 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.12, delayChildren: 0.18 }}
      >
        <motion.div className="text-center max-w-md px-4" initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, type: "spring", stiffness: 90 }}>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mb-4">No Itinerary Yet</h2>
          <p className="text-base sm:text-lg text-neutral-600 mb-6">
            {Object.keys(allItineraries).length > 0 
              ? "No itinerary found for current preferences. Try selecting a different saved itinerary or generate a new one."
              : "You need to generate an itinerary first from your recommendations."}
          </p>
          {/* ... (rest of the code remains the same) */}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.main
      className="min-h-screen bg-gradient-to-b from-white to-neutral-50 text-neutral-900 p-4 sm:p-6 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.12, delayChildren: 0.18 }}
    >
      <motion.h1
        className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 sm:mb-10 text-center tracking-wide select-none px-2"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 90 }}
      >
        Your <span className="bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent">Itinerary</span>
      </motion.h1>
      {/* ... (rest of the code remains the same) */}
    </motion.main>
  );
}