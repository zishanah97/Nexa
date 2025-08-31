import { configureStore } from "@reduxjs/toolkit";
import preferencesReducer from "./slices/preferencesSlice.js";
import recommendationReducer from "./slices/recommendationSlice.js";
import itineraryReducer from './slices/itinerarySlice.js';
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Persist configs for each slice
const preferencesPersistConfig = {
  key: "preferences",
  storage,
  whitelist: ['location', 'days', 'numPeople', 'budget'] // Only persist these fields
};

const recommendationPersistConfig = {
  key: "recommendation",
  storage,
  whitelist: ['recommendations'] // Only persist recommendations
};

const itineraryPersistConfig = {
  key: "itinerary",
  storage,
  whitelist: ['itineraries'], // Only persist itineraries
  debug: true // Enable debug logging for persistence
};

// Create persisted reducers
const persistedPreferencesReducer = persistReducer(preferencesPersistConfig, preferencesReducer);
const persistedRecommendationReducer = persistReducer(recommendationPersistConfig, recommendationReducer);
const persistedItineraryReducer = persistReducer(itineraryPersistConfig, itineraryReducer);

export const store = configureStore({
  reducer: {
    preferences: persistedPreferencesReducer,
    recommendation: persistedRecommendationReducer,
    itinerary: persistedItineraryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Debug: Log store creation
console.log("Redux store created with reducers:", Object.keys(store.getState()));

export const persistor = persistStore(store);

// Debug logging for store state
if (process.env.NODE_ENV === 'development') {
  store.subscribe(() => {
    const state = store.getState();
    console.log('Redux Store State:', {
      preferences: state.preferences,
      recommendationKeys: Object.keys(state.recommendation.recommendations),
      itineraryKeys: Object.keys(state.itinerary.itineraries),
      itineraryCount: Object.keys(state.itinerary.itineraries).length
    });
  });
  
  // Debug persistence
  persistor.subscribe(() => {
    console.log('Persistence state:', persistor.getState());
  });
}
