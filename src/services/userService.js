import apiClient from './apiClient';

// Fetch user profile
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/user/profile'); // API call to fetch user profile details
    return response;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (data) => {
  try {
    const response = await apiClient.put('/user/profile', data); // API call to update profile
    return response;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Delete a specific resume
export const deleteResume = async (resumeId) => {
    try {
      const response = await apiClient.delete(`/user/resume/${resumeId}`); // API call to delete resume
      if (response.success) {
        return response;
      }
      throw new Error(response.message || "Failed to delete resume");
    } catch (error) {
      console.error('Error deleting resume:', error);
      throw error;
    }
  };
