// src/store/itinerarySlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  itineraries: {} // Changed from single itinerary to multiple itineraries
};

const itinerarySlice = createSlice({
  name: "itinerary",
  initialState,
  reducers: {
    setItinerary: (state, action) => {
      const { key, data } = action.payload;
      console.log('Setting itinerary in slice:', { key, data });
      console.log('Previous itineraries:', state.itineraries);
      state.itineraries[key] = data;
      console.log('Updated itineraries:', state.itineraries);
    },
    clearItinerary: (state, action) => {
      if (action.payload?.key) {
        // Clear specific itinerary by key
        delete state.itineraries[action.payload.key];
      } else {
        // Clear all itineraries
        state.itineraries = {};
      }
    },
    // Helper action to get itinerary by key
    getItineraryByKey: (state, action) => {
      return state.itineraries[action.payload] || null;
    }
  }
});

export const { setItinerary, clearItinerary, getItineraryByKey } = itinerarySlice.actions;
export default itinerarySlice.reducer;
