import apiClient from './apiClient';

export const askQuestion = async (question) => {
  try {
    const response = await apiClient.post('/chatbot/ask', { question });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw { message: "Please login to continue using the chatbot" };
    }
    throw error.response?.data || { message: 'Failed to get response' };
  }
};

export const getCareerResources = async () => {
  try {
    const response = await apiClient.get('/chatbot/resources');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get resources' };
  }
};