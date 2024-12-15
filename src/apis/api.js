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
    if (response.data.code === 401) {
      console.log("Handling invalid token");
      window.location.href = "/login";
    }
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
        console.log("Retrying");
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
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

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

export const createMultipleFlight = async (data) => {
  try {
    const response = await apiClient.post(
      "/api/admin/v1/flights/add_batch",
      data
    );
    return response.data.message;
  } catch (error) {
    throw error;
  }
};

export const getFlightById = async (id) => {
  try {
    const response = await apiClient.get("/api/admin/v1/flights/get_by_id", {
      params: {
        id,
      },
    });
    return response.data.results;
  } catch (error) {
    throw error;
  }
};

export const filterFlights = async (filter) => {
  try {
    const response = await apiClient.get("/api/admin/v1/flights/filter", {
      params: filter,
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
    return response.data;
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
    const response = await apiClient.get("/api/admin/v1/news/filter_news", {
      params: {},
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching news data:", error);
    throw error;
  }
};

export const getAllNewsFolder = async () => {
  try {
    const response = await apiClient.get("/api/admin/v1/news/folders");
    return response.data.results;
  } catch (error) {
    throw error;
  }
};

export const getAllNewsClassification = async () => {
  try {
    const response = await apiClient.get("/api/admin/v1/news/classification");
    return response.data.results;
  } catch (error) {
    throw error;
  }
};

export const updateNews = async (data) => {
  try {
    const response = await apiClient.put("/api/admin/v1/news", data);
    return response.data.message;
  } catch (error) {
    throw error;
  }
};
export const deleteNews = async (newsId) => {
  try {
    const response = await apiClient.delete("/api/admin/v1/news", {
      params: {
        newsId,
      },
    });
    return response.data.message;
  } catch (error) {
    throw error;
  }
};

export const createNews = async (data) => {
  try {
    const response = await apiClient.post("/api/admin/v1/news", data);
    return response.data.message;
  } catch (error) {
    throw error;
  }
};

export const getBooking = async (filterParams) => {
  try {
    const response = await apiClient.get("/api/admin/v1/booking/filter", {
      params: {
        filterParams,
      },
    });
    return response.data.results;
  } catch (error) {
    throw error;
  }
};

export const closeFlight = async (flightId) => {
  try {
    const response = await apiClient.put(
      "/api/admin/v1/flights/close",
      flightId,
      {
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );
    return response.data.message;
  } catch (error) {
    throw error;
  }
};

export const openFlight = async (flightId) => {
  try {
    const response = await apiClient.put(
      "/api/admin/v1/flights/open",
      flightId,
      {
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );
    return response.data.message;
  } catch (error) {
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
    throw error;
  }
};

export const forgotPasswordApi = async (email) => {
  try {
    console.log("Email to reset: ", email);
    const response = await axios.post("/api/admin/v1/forgot_password", email, {
      baseURL: API_BASE_URL,
      headers: {
        "X-auth-token": "QAirline-API-Token",
        "Content-Type": "text/plain",
      },
    });
    return response.data.message;
  } catch (error) {
    throw error;
  }
};

export const getCityOfAirport = async (airportId) => {
  try {
    const response = await apiClient.get(
      "/api/admin/v1/airports/cities",
      airportId,
      {
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );
    return response.data.results;
  } catch (error) {
    throw error;
  }
};

export const fetchAdminData = async () => {
  try {
    const response = await apiClient.get("/api/admin/v1/current_admin");
    return response.data.results;
  } catch (error) {
    console.error("Error fetching current user");
    throw error;
  }
};
