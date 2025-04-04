import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { getUserProfile } from "../../services/userService";
import { getToken, isTokenExpired } from "../../utils/tokenUtils";
import Chatbot from "../chatBot/ChatBot";

const Dashboard = () => {
  const [userName, setUserName] = useState(""); // State to store user's name
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and the token is valid
    if (!getToken() || isTokenExpired()) {
      navigate("/login");
      return;
    }

    // Fetch user profile details
    const fetchUserName = async () => {
      try {
        const response = await getUserProfile(); // Fetch user profile from API
        setUserName(response.user.fullName); // Set the user's full name in state
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        navigate("/login"); // Redirect to login if fetching profile fails
      }
    };

    fetchUserName();
  }, [navigate]);

  const dashboardItems = [
    {
      title: "Resume Analyzer",
      description: "Analyze and optimize your resume",
      link: "/resume-analyzer",
      icon: "📄",
    },
    {
      title: "Cover Letter Generator",
      description: "Create tailored cover letters",
      link: "/cover-letter",
      icon: "✉️",
    },
    {
      title: "Course Recommendations",
      description: "Boost your skills",
      link: "/courses",
      icon: "📚",
    },
    {
      title: "Resume Maker (Premium)",
      description: "Create ATS-friendly resumes",
      link: "https://resume-builder-aii.onrender.com",
      icon: "✨",
    },
  ];

  return (
    <>
      <Container fluid className="bg-light py-5">
        <Row className="mb-4 text-center">
          <Col>
            <h1 className="fw-bold">
              Welcome, {userName || "User"}! 🚀
            </h1>
            <p className="text-secondary">Your career development dashboard</p>
          </Col>
        </Row>

        <Row className="justify-content-center">
          {dashboardItems.map((item, index) => (
            <Col key={index} md={3} sm={6} className="mb-4">
              <Card className="border-0 shadow-lg h-100 text-center">
                <Card.Body>
                  <div className="display-4 mb-3">{item.icon}</div>
                  <Card.Title className="fw-bold">{item.title}</Card.Title>
                  <Card.Text className="text-muted">{item.description}</Card.Text>
                  <Link to={item.link} className="btn btn-primary w-100">
                    Get Started →
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Chatbot /> {/* Chatbot Component */}
    </>
  );
};

export default Dashboard;
