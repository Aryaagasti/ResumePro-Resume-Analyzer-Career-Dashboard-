import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://finalyearmcabackend.onrender.com/api',
});

// Request interceptor
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('resume_pro_token'); // Changed from 'token' to 'resume_pro_token'
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Response interceptor
apiClient.interceptors.response.use(response => {
  return response.data;
}, error => {
  if (error.code === 'ECONNABORTED') {
    return Promise.reject({ message: 'Request timeout. Please try again.' });
  }
  
  if (error.response) {
    // Handle specific status codes
    const { status, data } = error.response;
    
    if (status === 401) {
      // Clear invalid token and redirect to login
      localStorage.removeItem('resume_pro_token');
      window.location.href = '/login?session_expired=true';
      return Promise.reject({ message: 'Session expired. Please login again.' });
    }
    
    // Handle 400 Bad Request specifically
    if (status === 400) {
      return Promise.reject(data || { message: 'Invalid request. Please check your input.' });
    }
    
    return Promise.reject(data || { message: `Request failed with status ${status}` });
  } else if (error.request) {
    return Promise.reject({ message: 'No response received from server. Please check your connection.' });
  } else {
    return Promise.reject({ message: error.message || 'Request failed' });
  }
});

export default apiClient;