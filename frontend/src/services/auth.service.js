import { postRequest } from '../api/apiClient';
import { LOGIN_API_URL } from '../utils/constants/api-url.constant';
import { setAccessToken, setUserInfo, clearLocalStorage, getUserInfo } from '../utils/app.utils';

export const loginUser = async (credentials) => {
  try {
    const response = await postRequest(LOGIN_API_URL, credentials);
    const { token, user } = response.data;

    if (token) setAccessToken(token);
    if (user) setUserInfo(user);

    return response.data;
  } catch (error) {
    throw error.mappedError || { title: 'Login Failed', message: 'Invalid credentials or account not found.' };
  }
};

export const logoutUser = () => {
  clearLocalStorage();
};

export const getCurrentUser = () => {
  return getUserInfo();
};

