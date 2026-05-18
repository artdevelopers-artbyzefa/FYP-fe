import { logger } from './logger';

const TOKEN_KEY = "token";
const USER_INFO_KEY = "user";

/**
 * Token Management
 */
export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
export const setAccessToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearLocalStorage = () => localStorage.clear();

/**
 * User Info Management
 */
export const getUserInfo = () => {
  try {
    const data = localStorage.getItem(USER_INFO_KEY);
    if (!data || data === "undefined" || data === "null") return null;
    return JSON.parse(data);
  } catch (error) {
    logger("Error parsing userInfo:", error);
    return null;
  }
};

export const setUserInfo = (userInfo) =>
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));

/**
 * Logout Utility
 */
export const logout = () => {
  clearLocalStorage();
  window.location.href = '/login';
};
