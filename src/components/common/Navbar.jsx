import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";
import { getUserProfile } from "../../services/userService";
import { getToken, isTokenExpired } from "../../utils/tokenUtils";

const NavigationBar = () => {
  const navigate = useNavigate();
  const isAuthenticated = getToken() && !isTokenExpired();
  const [userName, setUserName] = useState(""); // State to store user's name

  useEffect(() => {
    // Fetch user details if logged in and token is valid
    if (isAuthenticated) {
      const fetchUserName = async () => {
        try {
          const response = await getUserProfile(); // Get user profile API call
          setUserName(response.user.fullName); // Set user name
        } catch (error) {
          console.error("Failed to fetch user name:", error);
          navigate("/login"); // Redirect to login if profile fetch fails
        }
      };
      fetchUserName();
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("resume_pro_token"); // Remove token
    navigate("/login");
  };

  return (
    <Navbar expand="lg" style={{ backgroundColor: "#1A1A2E" }} variant="dark" sticky="top" className="shadow">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-light">
          ResumePro
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/dashboard" className="text-light">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/resume-analyzer" className="text-light">Resume Analyzer</Nav.Link>
                <NavDropdown title={`Hello, ${userName || "User"}`} id="nav-dropdown" menuVariant="dark">
                  <NavDropdown.Item as={Link} to="/courses">Courses</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/cover-letter">Cover Letter</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/feedback">Feedback</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="https://resume-builder-aii.onrender.com">Resume Maker (Premium)</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                </NavDropdown>
                <Button variant="danger" className="ms-3" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="text-light">Login</Nav.Link>
                <Nav.Link as={Link} to="/register" className="text-light">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
