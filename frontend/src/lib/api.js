import axios from 'axios';
import { ApiError, AuthError, ValidationError, ErrorHandler } from './error-handler';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let customError;

    if (error.response) {
      const { status, data } = error.response;
      const message = data?.message || error.message;

      if (status === 401 || status === 403) {
        customError = new AuthError(message, status);
      } else if (status === 400 || status === 422) {
        customError = new ValidationError(data?.errors || data, message);
      } else {
        customError = new ApiError(message, status, data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      customError = new ApiError('Network error: No response from server', 503);
    } else {
      // Something happened in setting up the request that triggered an Error
      customError = new ApiError(error.message, 500);
    }

    // Centrally handle the error (logging, toast notifications, etc.)
    ErrorHandler.handle(customError);

    return Promise.reject(customError);
  }
);

export default api;
