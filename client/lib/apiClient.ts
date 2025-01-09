import axios from "axios";

import { BASE_URL } from "@/lib/constants";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Helper function to handle logout
const handleLogout = async () => {
  try {
    await axios.get(`${BASE_URL}/auth/logout`, { withCredentials: true });
  } catch (logoutError) {
    console.error("Logout failed:", logoutError);
  }
};

// Error handling for expired access token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 403 Forbidden: Token expired
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If access token has expired, try to get another one with refresh token
        await axios.get(`${BASE_URL}/auth/refresh`, {
          withCredentials: true,
        });
        return apiClient(originalRequest);
      } catch (refreshError) {
        await handleLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
