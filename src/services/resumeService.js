import apiClient from './apiClient';

export const analyzeResume = async (file, jobDescription) => {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('job_description', jobDescription);

  try {
    const response = await apiClient.post('/resume/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    // Map the response to the desired format for the frontend
    const mappedResponse = {
      success: response.data.success,
      atsScore: response.data.atsScore || 0,
      keywords: response.data.keywords || [],
      missingKeywords: response.data.missingKeywords || [],
      scoreBreakdown: response.data.scoreBreakdown || {},
      suggestions: response.data.suggestions || []
    };

    return mappedResponse;
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw error.response?.data || { message: 'Failed to analyze resume' };
  }
};
