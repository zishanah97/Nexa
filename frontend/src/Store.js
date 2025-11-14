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
  whitelist: ['location', 'days', 'numPeople', 'budget', 'lastFetchedKey'] // Only persist these fields
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



export const persistor = persistStore(store);


