import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://finalyearmcabackend.onrender.com/api',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('resume_pro_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Response interceptor
apiClient.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    console.error('API Error:', error);
    
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({ message: 'Request timeout. Please try again.', success: false });
    }
    
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401) {
        localStorage.removeItem('resume_pro_token');
        window.location.href = '/login?session_expired=true';
        return Promise.reject({ ...data, success: false });
      }
      
      return Promise.reject({ 
        message: data.message || 'Request failed', 
        errors: data.errors,
        success: false
      });
    } 
    
    return Promise.reject({ 
      message: error.message || 'Network error', 
      success: false 
    });
  }
);

export default apiClient;