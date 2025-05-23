import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token"); // Modify this based on your auth logic
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
