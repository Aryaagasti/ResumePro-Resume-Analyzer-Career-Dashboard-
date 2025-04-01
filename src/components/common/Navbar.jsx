import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";

const NavigationBar = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
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
               

                <NavDropdown title="More" id="nav-dropdown" menuVariant="dark">
                  <NavDropdown.Item as={Link} to="/courses">Courses</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/cover-letter">Cover Letter</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/feedback">Feedback</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="https://resume-builder-aii.onrender.com">Resume Maker (Premium)</NavDropdown.Item> {/* ✅ Added */}
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