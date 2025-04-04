import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getToken, isTokenExpired } from "../../utils/tokenUtils";

const Footer = () => {
  const { user } = useAuth(); // Access user state via AuthContext
  const navigate = useNavigate();

  const handleRestrictedAccess = (path) => {
    if (!getToken() || isTokenExpired()) {
      navigate("/login"); // Redirect to login if no valid token
    } else {
      navigate(path); // Navigate to the requested path if authenticated
    }
  };

  return (
    <footer style={{ backgroundColor: "#16213E", color: "#EAEAEA" }} className="py-4 mt-5">
      <Container>
        <Row className="text-center">
          <Col md={4}>
            <h5 className="fw-bold">ResumePro</h5>
            <p>AI-powered resume analysis and job matching.</p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <span
                  className="text-light text-decoration-none"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRestrictedAccess("/resume-analyzer")}
                >
                  Resume Analyzer
                </span>
              </li>
              <li>
                <span
                  className="text-light text-decoration-none"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRestrictedAccess("https://resume-builder-aii.onrender.com")}
                >
                  ResumeMaker
                </span>
              </li>
              <li>
                <span
                  className="text-light text-decoration-none"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRestrictedAccess("/cover-letter")}
                >
                  Cover Letter
                </span>
              </li>
              <li>
                <span
                  className="text-light text-decoration-none"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRestrictedAccess("/courses")}
                >
                  Courses
                </span>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact Us</h5>
            <p>Email: support@resumepro.com</p>
          </Col>
        </Row>
        <hr className="bg-light" />
        <Row className="text-center">
          <Col>
            <p className="mb-0">&copy; {new Date().getFullYear()} ResumePro. All Rights Reserved.</p>
            <p><strong>Project by Arya Agasti & Anand Jugnake</strong></p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
