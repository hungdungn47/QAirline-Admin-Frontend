import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const ticketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    ticketsFetched(state, action) {
      return action.payload;
    },
    ticketsAdded(state, action) {
      state.push(action.payload);
    },
    ticketsUpdated(state, action) {
      const index = state.findIndex(
        (tickets) => tickets.id === action.payload.id
      );
      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload };
      }
    },
    ticketsDeleted(state, action) {
      return state.filter((tickets) => tickets.id !== action.payload);
    },
  },
});

export const { ticketsAdded, ticketsFetched, ticketsUpdated, ticketsDeleted } =
  ticketsSlice.actions;

export default ticketsSlice.reducer;
