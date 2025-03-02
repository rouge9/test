import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_API;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Ensures cookies are sent
});

// Function to get tokens from localStorage
const getAccessToken = () => localStorage.getItem("token");
const getRefreshToken = () => localStorage.getItem("refreshToken");

// Function to store tokens
const setAccessToken = (token: string) => localStorage.setItem("token", token);
const setRefreshToken = (refreshToken: string) =>
  localStorage.setItem("refreshToken", refreshToken);

// Function to refresh token
const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token available");

    const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
      token: refreshToken,
    });
    console.log(data);
    setAccessToken(data.accessToken);
    console.log("Token refreshed successfully");
    return data.accessToken;
  } catch (error) {
    console.error("Token refresh failed", error);
    logout();
    throw error;
  }
};

// Request Interceptor to attach Access Token
api.interceptors.request.use(
  async (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor to handle Token Expiry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest); // Retry request with new token
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Logout Function
const logout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("refreshToken");
  //   localStorage.removeItem("role");
  //   window.location.href = "/login"; // Redirect to login page
  console.log("logout");
};

export default api;
export { refreshAccessToken, logout, setAccessToken, setRefreshToken };
