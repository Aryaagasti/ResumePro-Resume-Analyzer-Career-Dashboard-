import { jwtDecode } from "jwt-decode";

// Token key in local storage
const TOKEN_KEY = "resume_pro_token";

// Save token to local storage
export const setToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

// Get token from local storage
export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

// Remove token from local storage
export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error removing token:", error);
  }
};

// Check if token exists
export const hasToken = () => {
  return !!getToken();
};

// Decode token and get user information
export const decodeToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Invalid token:", error);
    removeToken();
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = () => {
  const decodedToken = decodeToken();
  if (!decodedToken) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decodedToken.exp < currentTime;
};

// Get user ID from token
export const getUserId = () => {
  const decodedToken = decodeToken();
  return decodedToken ? decodedToken.user_id : null;
};

// Get user email from token
export const getUserEmail = () => {
  const decodedToken = decodeToken();
  return decodedToken ? decodedToken.email : null;
};

// Refresh token (if your backend supports token refresh)
export const refreshToken = async () => {
  try {
    // Implement token refresh logic here
    const currentToken = getToken();
    // Replace with actual refresh token API call
    // const newToken = await apiClient.post('/auth/refresh', { token: currentToken });
    // setToken(newToken);
  } catch (error) {
    console.error("Token refresh failed:", error);
    removeToken();
    window.location.href = "/login";
  }
};
