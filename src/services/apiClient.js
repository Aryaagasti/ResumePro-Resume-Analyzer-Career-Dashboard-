import axios from 'axios';
import { getToken, removeToken } from '../utils/tokenUtils';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://finalyearmcabackend.onrender.com/api',
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!error.config.url.includes('/chatbot/')) {
        removeToken();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;