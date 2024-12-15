import { configureStore } from "@reduxjs/toolkit";
import newsReducer from "./newsSlice";
import flightsReducer from "./flightsSlice";
import aircraftsReducer from "./aircraftsSlice";
import ticketsReducer from "./ticketsSlice";

export const store = configureStore({
  reducer: {
    news: newsReducer,
    flights: flightsReducer,
    aircrafts: aircraftsReducer,
    tickets: ticketsReducer,
  },
});
