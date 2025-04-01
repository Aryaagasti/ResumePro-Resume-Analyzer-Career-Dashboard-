import apiClient from './apiClient';

export const analyzeResume = async (file, jobDescription) => {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('job_description', jobDescription);

  try {
    const response = await apiClient.post('/resume/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to analyze resume' };
  }
};