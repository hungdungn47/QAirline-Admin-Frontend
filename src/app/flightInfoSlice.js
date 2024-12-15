import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentFlight: null,
  loading: false,
  error: null,
  filters: {
    origin: "",
    destination: "",
    departureTimeStart: "",
    departureTimeEnd: "",
  },
  isFiltering: false,
  aircrafts: [],
  airports: [],
};

const flightsSlice = createSlice({
  name: "flights",
  initialState,
  reducers: {
    setCurrentFlight: (state, action) => {
      state.currentFlight = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    setIsFiltering: (state, action) => {
      state.isFiltering = action.payload;
    },
    setAircrafts: (state, action) => {
      state.aircrafts = action.payload;
    },
    setAirports: (state, action) => {
      state.airports = action.payload;
    },
  },
});

export const {
  setFlights,
  setCurrentFlight,
  setLoading,
  setError,
  setFilters,
  setIsFiltering,
  setAircrafts,
  setAirports,
} = flightsSlice.actions;

export default flightsSlice.reducer;
