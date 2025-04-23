import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { getToken, isTokenExpired, removeToken } from "../utils/tokenUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileUpload,
  faRobot,
  faPaperPlane,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (token && !isTokenExpired()) {
      setIsLoggedIn(true);
      navigate("/dashboard"); // Redirect to dashboard automatically
    } else {
      setIsLoggedIn(false);
      removeToken(); // Remove expired or invalid token
    }
  }, [navigate]);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <Container
        fluid
        className="hero-section text-center text-white d-flex align-items-center justify-content-center"
        style={{
          height: "100vh",
          background: "linear-gradient(135deg, #1e3c72, #2a5298)",
          color: "white",
        }}
      >
        <Row>
          <Col>
            <h1 className="display-2 fw-bold mb-3">🚀 ResumePro: Your Career Companion</h1>
            <p className="lead mb-4 fs-4">
              AI-powered resume analysis, job matching, and career development tools.
            </p>
            <div>
              {!isLoggedIn ? (
                <>
                  <Link to="/register" className="btn btn-lg btn-light fw-bold px-4 me-3 shadow-sm">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn btn-lg btn-outline-light fw-bold px-4 shadow-sm">
                    Login
                  </Link>
                </>
              ) : (
                <Link to="/dashboard" className="btn btn-lg btn-light fw-bold px-4 shadow-sm">
                  Go to Dashboard
                </Link>
              )}
            </div>
          </Col>
        </Row>
      </Container>

      {/* Features Section */}
      <Container className="py-5">
        <Row className="text-center">
          {[
            {
              icon: faFileUpload,
              title: "Resume Analyzer",
              text: "Instant AI-powered resume evaluation and optimization",
              color: "text-primary",
            },
            {
              icon: faRobot,
              title: "Job Matcher",
              text: "Find the most suitable jobs based on your skills",
              color: "text-success",
            },
            {
              icon: faPaperPlane,
              title: "Cover Letter",
              text: "Generate personalized cover letters automatically",
              color: "text-danger",
            },
            {
              icon: faChartLine,
              title: "Career Insights",
              text: "Get recommendations for skill development",
              color: "text-warning",
            },
          ].map((feature, index) => (
            <Col md={3} className="p-4" key={index}>
              <div
                className="p-4 rounded shadow-lg bg-white"
                style={{
                  borderRadius: "12px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <FontAwesomeIcon icon={feature.icon} size="3x" className={`mb-3 ${feature.color}`} />
                <h4 className="fw-bold">{feature.title}</h4>
                <p className="text-muted">{feature.text}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Home;
