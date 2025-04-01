import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Home from "./components/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import ResumeAnalyzer from "./components/resume/ResumeAnalyzer";
import CourseRecommendation from "./components/job/CourseRecommendation";
import CoverLetterGenerator from "./components/tools/CoverLetterGenerator";
import FeedbackAnalyzer from "./components/tools/FeedbackAnalyzer";
import PrivateRoute from "./components/common/PrivateRoute";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import Chatbot from "./components/chatBot/ChatBot"; // Keep this import

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Container fluid className="main-content">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/resume-analyzer" element={<PrivateRoute><ResumeAnalyzer /></PrivateRoute>} />
              <Route path="/courses" element={<PrivateRoute><CourseRecommendation /></PrivateRoute>} />
              <Route path="/cover-letter" element={<PrivateRoute><CoverLetterGenerator /></PrivateRoute>} />
              <Route path="/feedback" element={<PrivateRoute><FeedbackAnalyzer /></PrivateRoute>} />
              {/* Removed the /chatbot route */}
            </Routes>
          </ErrorBoundary>
        </Container>
        <Footer />
        {/* Add Chatbot here to make it available on all pages */}
        <Chatbot />
      </Router>
    </AuthProvider>
  );
}

export default App;