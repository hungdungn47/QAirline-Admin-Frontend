import axios from "axios";

import { useNavigate } from "react-router-dom";

// const API_BASE_URL = "https://9w2jqf90-7070.asse.devtunnels.ms";
const API_BASE_URL = "https://qairlline-backend.onrender.com";

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
  async (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Avoid infinite loop
      try {
        const { data } = await axios.post(
          "/api/admin/v1/refresh_jwt",
          localStorage.getItem("refreshToken"),
          {
            baseURL: API_BASE_URL,
            headers: {
              "Content-Type": "text/plain",
              "X-auth-token": "QAirline-API-Token",
            },
          }
        );

        localStorage.setItem("accessToken", data.message);
        originalRequest.headers["Authorization"] = data.message;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token expired. Please log in again.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        const navigate = useNavigate();
        navigate("/login", { replace: true });
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
    return response.data.message;
  } catch (error) {
    throw error;
  }
};

export const getFlightById = async (id) => {
  try {
    const response = await apiClient.get("/api/admin/v1/flights/getById", {
      params: {
        id,
      },
    });
    return response.data.results;
  } catch (error) {
    throw error;
  }
};

export const changeFlightAircraft = async (flightData, newAircraftId) => {
  try {
    const reqBody = {
      ...flightData,
      originAirport: flightData.originAirport.id,
      destinationAirport: flightData.destinationAirport.id,
      plane: newAircraftId,
    };
    console.log("Changing aircraft");
    const response = await apiClient.put("/api/admin/v1/flights", reqBody);
    return response.data.message;
  } catch (err) {
    throw err;
  }
};

export const delayFlight = async (flightId, newDepartureTime) => {
  try {
    const response = await apiClient.put("/api/admin/v1/flights/delay", {
      id: flightId,
      newDepartureTime,
    });
    return response.data.message;
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
