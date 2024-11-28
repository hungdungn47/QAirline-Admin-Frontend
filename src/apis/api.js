import axios from "axios";

const API_BASE_URL = "https://9w2jqf90-7070.asse.devtunnels.ms";

// Set up axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-auth-token": "QAirline-API-Token",
  },
});

// Add an interceptor to inject the token into requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export const getFlightsData = async () => {
  try {
    const response = await apiClient.get("/api/admin/v1/flights");
    return response.data.results;
  } catch (error) {
    console.error("Error fetching flights data:", error);
    throw error;
  }
};

export const fetchAircrafts = async () => {
  try {
    const response = await apiClient.get("/api/admin/v1/planes");
    return response.data.results;
  } catch (error) {
    console.error("Error fetching aircraft data:", error);
    throw error;
  }
};

export const fetchNewsApi = async () => {
  try {
    const response = await apiClient.get("/api/admin/v1/news/filterNews", {
      params: {
        folder: "Test",
      },
    });
    console.log(response);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching news data:", error);
    throw error;
  }
};

// export const createNewsApi = async () => {
//   try {
//     const response = await apiClient.post("api/admin/v1/news");
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching news data:", error);
//     throw error;
//   }
// };

export const loginApi = async (username, password) => {
  try {
    const response = await apiClient.post("/api/admin/v1/authenticate", {
      username,
      password,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const refreshToken = async () => {
  const response = await apiClient.post("/api/admin/v1/refresh_jwt", {
    refreshToken: localStorage.getItem("refreshToken"),
  });
  return response.data; // { accessToken }
};
