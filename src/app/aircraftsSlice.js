import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const aircraftsSlice = createSlice({
  name: "aircrafts",
  initialState,
  reducers: {
    aircraftsFetched(state, action) {
      return action.payload;
    },
    aircraftsAdded(state, action) {
      state.push(action.payload);
    },
    aircraftsUpdated(state, action) {
      const index = state.findIndex(
        (aircrafts) => aircrafts.id === action.payload.id
      );
      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload };
      }
    },
    aircraftsDeleted(state, action) {
      return state.filter((aircrafts) => aircrafts.id !== action.payload);
    },
  },
});

export const {
  aircraftsAdded,
  aircraftsFetched,
  aircraftsUpdated,
  aircraftsDeleted,
} = aircraftsSlice.actions;

export default aircraftsSlice.reducer;
