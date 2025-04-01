import apiClient from './apiClient';

export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response && response.token) {
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
    if (response  && response.token) {
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

export const getUserDetails = async () => {
  try {
      const response = await apiClient.get('/auth/user');
      return response.data;
  } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
  }
};
