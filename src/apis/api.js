// src/networking/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "", // Set your base URL here or in environment variable
  headers: {
    "Content-Type": "application/json",
  },
});

export const getFlightsData = async () => {
  try {
    const response = await api.get("/flightsData.json"); // Assuming the file is served from /public
    return response.data;
  } catch (error) {
    console.error("Error fetching flights data:", error);
    throw error; // Re-throw error to handle it in the UI
  }
};

export default api;