import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { setItinerary, clearItinerary } from "../slices/itinerarySlice.js";
import { setPreferences } from "../slices/preferencesSlice.js";



function Card({ children, className }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }} // Subtle hover for engagement
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`bg-white/10 backdrop-blur-md border border-purple-600 rounded-2xl shadow-md overflow-hidden ${className}`}
      role="article" // Accessibility: ARIA role
    >
      {children}
    </motion.div>
  );
}

function CardContent({ children, className }) {
  return (
    <div className={`p-3 sm:p-5 flex flex-col sm:flex-row gap-3 sm:gap-6 items-start ${className}`}>
      {children}
    </div>
  );
}

function Badge({ children, className }) {
  return (
    <span className={`bg-purple-700/80 border border-purple-500 text-white capitalize px-2 sm:px-3 py-1 rounded-full text-xs font-semibold select-none flex-shrink-0 ${className}`}>
      {children} ✨ {/* Subtle emoji for modern engagement */}
    </span>
  );
}

function Separator({ className }) {
  return (
    <hr className={`border-t border-purple-500/25 my-8 ${className}`} />
  );
}

export default function Itinerary() {
  const preferences = useSelector((state) => state.preferences);
  const allItineraries = useSelector((state) => state.itinerary.itineraries);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get the current itinerary based on preferences
  const itineraryKey = JSON.stringify(preferences);
  let itinerary = allItineraries[itineraryKey];
  
  // If no exact match, try to find the best matching itinerary
  if (!itinerary && Object.keys(allItineraries).length > 0) {
    const bestMatch = findBestMatchingItinerary(preferences, allItineraries);
    if (bestMatch) {
      itinerary = bestMatch;
    }
  }
  
  // Helper function to find best matching itinerary
  function findBestMatchingItinerary(currentPrefs, storedItineraries) {
    let bestMatch = null;
    let bestScore = 0;
    
    for (const key in storedItineraries) {
      try {
        const storedPrefs = JSON.parse(key);
        let score = 0;
        
        // Score based on matching preferences
        if (storedPrefs.location === currentPrefs.location) score += 3;
        if (storedPrefs.days === currentPrefs.days) score += 2;
        if (storedPrefs.numPeople === currentPrefs.numPeople) score += 1;
        if (storedPrefs.budget === currentPrefs.budget) score += 1;
        
        if (score > bestScore) {
          bestScore = score;
          bestMatch = storedItineraries[key];
        }
      } catch (e) {
        // Skip invalid JSON keys
      }
    }
    
    return bestMatch;
  }

  // Debug logging
  console.log("Itinerary Component Debug:", {
    preferences,
    itineraryKey,
    itinerary,
    itineraryType: typeof itinerary,
    itineraryLength: itinerary?.length,
    allItineraries: Object.keys(allItineraries),
    fullState: useSelector((state) => state)
  });

  if (!itinerary || itinerary.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-400 bg-black p-4 sm:p-6">
        <div className="text-center max-w-md px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">No Itinerary Yet</h2>
          <p className="text-base sm:text-lg mb-4 sm:mb-6">
            {Object.keys(allItineraries).length > 0 
              ? "No itinerary found for current preferences. Try selecting a different saved itinerary or generate a new one."
              : "You need to generate an itinerary first from your recommendations."
            }
          </p>
          
          {/* Show available itineraries if any exist */}
          {Object.keys(allItineraries).length > 0 && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-800/50 rounded-xl">
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Available Itineraries:</h3>
              <div className="space-y-2">
                {Object.keys(allItineraries).map((key) => {
                  try {
                    const prefs = JSON.parse(key);
                    return (
                      <button
                        key={key}
                        onClick={() => dispatch(setPreferences(prefs))}
                        className="w-full p-2 sm:p-3 text-left bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <div className="text-white font-medium text-sm sm:text-base">{prefs.location}</div>
                        <div className="text-xs sm:text-sm text-gray-400">{prefs.days} • {prefs.numPeople}</div>
                      </button>
                    );
                  } catch (e) {
                    return null;
                  }
                })}
              </div>
            </div>
          )}
          
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <button
              onClick={() => window.history.back()}
              className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform text-sm sm:text-base"
            >
              ← Go Back to Recommendations
            </button>
            <button
              onClick={() => {
                // Test with sample data
                const sampleItinerary = [
                  {
                    day: 1,
                    theme: "Welcome to Your Destination",
                    activities: [
                      {
                        time: "Morning",
                        title: "Airport Arrival & Check-in",
                        description: "Start your adventure with a smooth arrival",
                        category: "travel",
                        duration: "2 hours",
                        est_cost_per_person: { min: 0, max: 50 }
                      }
                    ]
                  }
                ];
                // Store with current preferences key
                const testKey = JSON.stringify(preferences);
                dispatch(setItinerary({ key: testKey, data: sampleItinerary }));
              }}
              className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform text-sm sm:text-base"
            >
              🧪 Test with Sample Data
            </button>
            
            <button
              onClick={() => {
                console.log("Current Redux State:");
                console.log("Preferences:", preferences);
                console.log("All Itineraries:", allItineraries);
                console.log("Itinerary Key:", itineraryKey);
                console.log("Current Itinerary:", itinerary);
              }}
              className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform text-sm sm:text-base"
            >
              🔍 Debug Redux State
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 sm:p-6 relative">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 sm:mb-10 text-center tracking-wide select-none px-2">
        Your <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">Itinerary</span>
      </h1>
      
      {/* Show current location and saved itineraries */}
      <div className="text-center mb-6 px-4">
        {preferences.location && (
          <p className="text-lg sm:text-xl text-gray-300 mb-3">
            📍 <span className="text-white font-semibold">{preferences.location}</span>
            {preferences.days && ` • ${preferences.days}`}
            {preferences.numPeople && ` • ${preferences.numPeople}`}
          </p>
        )}
        
        {/* Show saved itineraries count */}
        {Object.keys(allItineraries).length > 0 && (
          <p className="text-xs sm:text-sm text-gray-500 mb-3">
            💾 {Object.keys(allItineraries).length} saved itinerary{Object.keys(allItineraries).length > 1 ? 's' : ''}
          </p>
        )}
        
        {/* Show saved itineraries dropdown if multiple exist */}
        {Object.keys(allItineraries).length > 1 && (
          <div className="w-full max-w-sm mx-auto px-4">
            <label className="block text-xs text-gray-400 mb-2 text-center">Saved Itineraries:</label>
            
            {/* Mobile-first responsive layout */}
            <div className="space-y-3">
              {/* Dropdown and delete button - stack on mobile, side by side on larger screens */}
              <div className="flex flex-col sm:flex-row gap-2">
                <select 
                  value={itineraryKey}
                  onChange={(e) => {
                    const selectedPrefs = JSON.parse(e.target.value);
                    dispatch(setPreferences(selectedPrefs));
                  }}
                  className="flex-1 px-2 py-2 bg-gray-800 border border-purple-500 rounded-lg text-white focus:outline-none focus:border-purple-400 text-sm"
                >
                  {Object.keys(allItineraries).map((key) => {
                    try {
                      const prefs = JSON.parse(key);
                      return (
                        <option key={key} value={key} className="text-sm">
                          {prefs.location} • {prefs.days} • {prefs.numPeople}
                        </option>
                      );
                    } catch (e) {
                      return null;
                    }
                  })}
                </select>
                
                {/* Delete button - always visible */}
                <button
                  onClick={() => {
                    if (confirm(`Delete itinerary for ${preferences.location}?`)) {
                      dispatch(clearItinerary({ key: itineraryKey }));
                    }
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium flex-shrink-0"
                  title="Delete current itinerary"
                >
                  🗑️ Delete
                </button>
              </div>
              
              {/* Clear all button - centered and smaller */}
              <div className="text-center">
                <button
                  onClick={() => {
                    if (confirm("Delete all saved itineraries?")) {
                      dispatch(clearItinerary());
                    }
                  }}
                  className="text-xs text-red-400 hover:text-red-300 underline px-2 py-1 rounded hover:bg-red-400/10"
                >
                  Clear All Itineraries
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Show fallback message if using different preferences */}
      {itinerary && !allItineraries[itineraryKey] && (
        <div className="max-w-2xl mx-auto mb-6 sm:mb-8 p-3 sm:p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl mx-4">
          <p className="text-yellow-400 text-center text-xs sm:text-sm">
            📍 Showing itinerary for similar preferences. 
            <button 
              onClick={() => navigate("/home")}
              className="ml-2 underline hover:text-yellow-300 block sm:inline mt-1 sm:mt-0"
            >
              Search for exact match
            </button>
          </p>
        </div>
      )}

      <div className="relative max-w-5xl mx-auto px-2">
        {/* Vertical timeline line with glow effect */}
        <div className="absolute left-3 sm:left-7 top-0 w-1 h-full bg-gradient-to-b from-pink-500 to-purple-500 rounded-full z-0 shadow-glow" /> {/* Glow for immersion */}

        <div className="ml-8 sm:ml-16 space-y-12 sm:space-y-16">
          {itinerary.map((day, dayIndex) => (
            <motion.section
              key={day?.day ?? dayIndex}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: dayIndex * 0.2, duration: 0.5, ease: "easeInOut" }} // Smoother easing
              className="relative z-10"
              aria-label={`Day ${day.day} itinerary: ${day.theme}`}
            >
              {/* Day Header */}
              <header className="flex items-center gap-3 sm:gap-6 mb-6 sm:mb-8">
                <motion.span
                  whileHover={{ scale: 1.1 }} // Interactive day badge
                  className="flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 font-extrabold text-white text-sm sm:text-lg select-none shadow-lg flex-shrink-0"
                >
                  {day.day}
                </motion.span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-2xl font-bold">{`Day ${day.day}`}</h2>
                  <p className="text-gray-400 italic text-sm sm:text-base max-w-xl">{day.theme}</p>
                </div>
              </header>

              {/* Activities with grid layout for better flow */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {day.activities.map((act, i) => (
                  <Card
                    key={`${act.title}-${i}`}
                    className="hover:scale-[1.04] transition-transform duration-300"
                  >
                    <CardContent>
                      {act.image?.imageUrl ? (
                        <img
                          src={act.image.imageUrl}
                          alt={act.title}
                          loading="lazy"
                          className="w-full h-32  sm:w-44 sm:h-44 rounded-xl object-cover flex-none drop-shadow-md" // Added shadow for depth
                        />
                      ) : (
                        <div className="w-full h-32  sm:w-44 sm:h-44 rounded-xl bg-gray-800 flex items-center justify-center text-gray-600 text-sm">
                          No Image 📍 {/* Emoji placeholder for visual interest */}
                        </div>
                      )}

                      <div className="flex-1 flex flex-col gap-2 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <h3 className="text-lg sm:text-xl font-semibold break-words">{act.title}</h3>
                          <Badge className="self-start sm:self-auto">{act.category}</Badge>
                        </div>

                        <p className="text-gray-300 text-xs sm:text-sm">{`${act.time} • ${act.duration}`}</p>
                        <p className="text-gray-200 mt-1 text-sm sm:text-base">{act.description}</p>

                        {act.est_cost_per_person && (
                          <p className="text-gray-400 text-xs mt-2">
                            💰 {act.est_cost_per_person.min} – {act.est_cost_per_person.max} per person
                          </p>
                        )}

                        {act.map_hint && (
                          <p className="text-gray-500 text-xs mt-1 break-words">
                            📍{" "}
                            <a
                              href={`https://www.google.com/maps/search/${encodeURIComponent(act.map_hint)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline hover:text-pink-400 transition break-all"
                            >
                              {act.map_hint}
                            </a>
                          </p>
                        )}

                        {act.image?.photographer && (
                          <a
                            href={act.image.photographerProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink-400 text-xs mt-2 inline-block hover:underline break-words"
                            aria-label={`Photo by ${act.image.photographer}`}
                          >
                            📸 {act.image.photographer}
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator />
            </motion.section>
          ))}
        </div>
      </div>
    </main>
  );
}