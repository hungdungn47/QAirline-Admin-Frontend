import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    newsFetched(state, action) {
      return action.payload;
    },
    newsAdded(state, action) {
      state.push(action.payload);
    },
    newsUpdated(state, action) {
      const index = state.findIndex((news) => news.id === action.payload.id);
      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload };
      }
    },
    newsDeleted(state, action) {
      return state.filter((news) => news.id !== action.payload);
    },
  },
});

export const { newsAdded, newsFetched, newsUpdated, newsDeleted } =
  newsSlice.actions;

export default newsSlice.reducer;
