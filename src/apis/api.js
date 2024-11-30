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

const clientNoInterceptor = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-auth-token": "QAirline-API-Token",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Avoid infinite loop
      try {
        const { data } = await axios.post("/api/admin/v1/refresh_jwt", {
          refreshToken: localStorage.getItem("refreshToken"),
        });

        // Save the new access token
        localStorage.setItem("accessToken", data.accessToken);

        // Update and retry the failed request
        originalRequest.headers["Authorization"] = data.accessToken;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Handle refresh token expiration or invalidity
        console.error("Refresh token expired. Please log in again.");
        // Log out the user or redirect to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Add an interceptor to inject the token into requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export const createFlight = async (data) => {
  try {
    const response = await apiClient.post("/api/admin/v1/flights", data);
    return response.data.results;
  } catch (error) {
    throw error;
  }
};

export const updateFlight = async (data) => {
  try {
    const response = await apiClient.put("/api/admin/v1/flights", data);
    return response.data.results;
  } catch (err) {
    throw err;
  }
};

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

export const createAircraft = async (data) => {
  try {
    const response = await apiClient.post("/api/admin/v1/planes", data);
    return response.data.message;
  } catch (error) {
    console.error("Error creating aircraft", error);
    throw error;
  }
};

export const updateAircraft = async (data) => {
  try {
    const response = await apiClient.put("/api/admin/v1/planes", data);
    return response.data.message;
  } catch (error) {
    console.error("Error updating aircraft", error);
    throw error;
  }
};

export const deleteAircraft = async (id) => {
  try {
    const response = await apiClient.delete("/api/admin/v1/planes", {
      params: {
        id: id,
      },
    });
    return response.data.message;
  } catch (error) {
    console.error("Error deleting aircraft", error);
    throw error;
  }
};

export const fetchAirports = async () => {
  try {
    const response = await apiClient.get("/api/admin/v1/airports");
    return response.data.results;
  } catch (error) {
    console.error("Error fetching airports data:", error);
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

export const loginApi = async (username, password) => {
  try {
    const response = await clientNoInterceptor.post(
      "/api/admin/v1/authenticate",
      {
        username,
        password,
      }
    );
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
