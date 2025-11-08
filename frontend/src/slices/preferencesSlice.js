import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  location: "",
  days: "",
  numPeople: "",
  budget: "",
  lastFetchedKey: null, // Track last preferences used for API calls
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    setPreferences: (state, action) => {
      state.location = action.payload.location;
      state.days = action.payload.days;
      state.numPeople = action.payload.numPeople;
      state.budget = action.payload.budget;
    },
    setLastFetchedKey: (state, action) => {
      state.lastFetchedKey = action.payload;
    },
    clearPreferences: (state) => {
      state.location = "";
      state.days = "";
      state.numPeople = "";
      state.budget = "";
      state.lastFetchedKey = null;
    },
  },
});

export const { setPreferences, clearPreferences, setLastFetchedKey } = preferencesSlice.actions;
export default preferencesSlice.reducer;
