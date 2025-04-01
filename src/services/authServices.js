import apiClient from './apiClient';
import { setToken } from '../utils/tokenUtils';

export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    setToken(response.data.token);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

export const register = async (email, name, password) => {
  try {
    const response = await apiClient.post('/auth/register', { email, name, password });
    setToken(response.data.token);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

export const getUserDetails = async () => {
  try {
    const response = await apiClient.get('/user/details');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user details' };
  }
};