
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  recommendations: {}  
};

const recommendationSlice = createSlice({
  name: "recommendation",
  initialState,
  reducers: {
    setRecommendation: (state, action) => {
      const { key, data } = action.payload;
      console.log('Setting recommendation:', { key, data });
      state.recommendations[key] = data;
    },
    clearRecommendations: (state) => {
      state.recommendations = {};
    }
  }
});

export const { setRecommendation, clearRecommendations } = recommendationSlice.actions;
export default recommendationSlice.reducer;
