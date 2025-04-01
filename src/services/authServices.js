import apiClient from './apiClient';

export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.success && response.token) {
      localStorage.setItem('resume_pro_token', response.token);
      return response;
    }
    throw new Error(response.error || 'Login failed');
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (email, name, password) => {
  try {
    const response = await apiClient.post('/auth/register', { email, name, password });
    if (response.success && response.token) {
      localStorage.setItem('resume_pro_token', response.token);
      return response;
    }
    throw new Error(response.error || 'Registration failed');
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('resume_pro_token');
};