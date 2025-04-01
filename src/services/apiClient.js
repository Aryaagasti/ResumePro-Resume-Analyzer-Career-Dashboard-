import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://finalyearmcabackend.onrender.com/api',
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
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
      // Redirect to login if token is invalid
      window.location.href = '/login?session_expired=true';
      return;
    }
    
    return Promise.reject(data || { message: `Request failed with status ${status}` });
  } else if (error.request) {
    return Promise.reject({ message: 'No response received from server' });
  } else {
    return Promise.reject({ message: error.message || 'Request failed' });
  }
});

export default apiClient;