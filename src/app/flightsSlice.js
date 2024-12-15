import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const flightsSlice = createSlice({
  name: "flights",
  initialState,
  reducers: {
    flightsFetched(state, action) {
      return action.payload;
    },
    flightsAdded(state, action) {
      state.push(action.payload);
    },
    flightsUpdated(state, action) {
      const index = state.findIndex(
        (flights) => flights.id === action.payload.id
      );
      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload };
      }
    },
    flightsDeleted(state, action) {
      return state.filter((flights) => flights.id !== action.payload);
    },
  },
});

export const { flightsAdded, flightsFetched, flightsUpdated, flightsDeleted } =
  flightsSlice.actions;

export default flightsSlice.reducer;
