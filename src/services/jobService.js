import apiClient from './apiClient';

export const matchJobs = async (formData) => {
  try {
    const response = await apiClient.post("/job/match", formData, {
      headers: { 
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${localStorage.getItem('resume_pro_token')}`
      },
    });
    return response;
  } catch (error) {
    console.error("Job matching error:", error);
    throw {
      message: error.response?.data?.error || "Failed to match jobs",
      status: error.response?.status || 500
    };
  }
};
export const searchJobs = async (filters) => {
  try {
    const response = await apiClient.post("/jobs/search", filters);
    return response.data;
  } catch (error) {
    return { success: false, error: error.response?.data?.error || "Server Error" };
  }
};

export const matchJobDescription = async (resumeFile, jobDescription) => {
  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("job_description", jobDescription);

  try {
    const response = await apiClient.post("/job/match", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    return { success: false, error: error.response?.data?.error || "Server Error" };
  }
};

export const recommendCourses = async (resumeText) => {
  try {
    const response = await apiClient.post('/course/recommend', { resume_text: resumeText });
    return response.data;
  } catch (error) {
    console.error('Course recommendation error:', error);
    throw error.response?.data || { message: 'Unable to recommend courses' };
  }
};

export const generateCoverLetter = async (resumeText, jobDescription) => {
  if (!resumeText || resumeText.trim().length < 50) {
    throw new Error('Resume text is too short or empty');
  }

  if (!jobDescription || jobDescription.trim().length < 50) {
    throw new Error('Job description is too short or empty');
  }

  try {
    const response = await apiClient.post('/cover-letter/generate', { 
      resume_text: resumeText.trim(), 
      job_description: jobDescription.trim() 
    });
    
    if (!response?.data?.cover_letter) {
      throw new Error('Cover letter generation failed');
    }
    
    return {
      cover_letter: response.data.cover_letter,
      success: true
    };
  } catch (error) {
    console.error('Cover letter generation error:', error);
    
    if (error.response) {
      throw new Error(
        error.response.data?.error || 
        'Server error during cover letter generation'
      );
    } else if (error.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error('Error setting up cover letter generation request');
    }
  }
};

export const analyzeFeedback = async (feedback) => {
  try {
    const response = await apiClient.post('/feedback/analyze', { feedback }, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('resume_pro_token')}`
      }
    });
    return response;
  } catch (error) {
    console.error("Feedback analysis error:", error);
    throw {
      message: error.response?.data?.error || "Failed to analyze feedback",
      status: error.response?.status || 500
    };
  }
};