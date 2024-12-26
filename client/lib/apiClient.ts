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
	} finally {
		localStorage.removeItem("token");
		window.location.href = "/login";
	}
};

// Add token to request headers
apiClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Error handling for expired access token
apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// Handle 401 Unauthorized: No token or invalid token
		if (error.response?.status === 401) {
			// Call logout endpoint to clear refresh token
			await handleLogout();
			return Promise.reject(error);
		}

		// Handle 403 Forbidden: Token expired
		if (error.response?.status === 403 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// If access token has expired, try to get another one with refresh token
				const res = await axios.get(`${BASE_URL}/auth/refresh`, {
					withCredentials: true,
				});
				const newToken = res.data.token;

				// New access token received
				localStorage.setItem("token", newToken);

				// Retry original request with new token
				originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
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
