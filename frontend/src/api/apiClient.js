import axios from 'axios';
import { getAccessToken, clearLocalStorage } from '../utils/app.utils';

const apiUrl = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: apiUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Global Error Mapping
 */
const mapErrorToMessage = (error) => {
  let title = "Something went wrong";
  let message = "We couldn’t process your request right now.";

  if (!error.response) {
    title = "Connection Error";
    message = "Unable to connect to the server. Please check your internet.";
  } else {
    const status = error.response.status;
    const backendMessage = error.response?.data?.message || error.response?.data?.error;

    switch (status) {
      case 400: title = "Action Required"; message = "Please check your input."; break;
      case 401: title = "Session Expired"; message = "Please login again."; break;
      case 403: title = "Access Denied"; message = "You don't have permission."; break;
      case 404: title = "Not Found"; message = "The resource doesn't exist."; break;
      case 500: title = "Server Error"; message = "Technical difficulties, please try again later."; break;
      default: break;
    }

    if (backendMessage) message = backendMessage;
  }
  return { title, message };
};

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearLocalStorage();
      // Only redirect if not already on login page to avoid loops
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    const { title, message } = mapErrorToMessage(error);
    // Attach mapped error for use in components
    error.mappedError = { title, message };
    
    return Promise.reject(error);
  }
);

/**
 * Named Request Exports
 */
export const getRequest = (url, config = {}) => apiClient.get(url, config);
export const postRequest = (url, params, config = {}) => apiClient.post(url, params, config);
export const putRequest = (url, params, config = {}) => apiClient.put(url, params, config);
export const deleteRequest = (url, config = {}) => apiClient.delete(url, config);

export default apiClient;
