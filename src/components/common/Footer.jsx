import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
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
              <li><Link className="text-light text-decoration-none" to="/resume-analyzer">Resume Analyzer</Link></li>
              <li><Link className="text-light text-decoration-none" to="https://resume-builder-aii.onrender.com">ResumeMaker</Link></li>
              <li><Link className="text-light text-decoration-none" to="/cover-letter">Cover Letter</Link></li>
              <li><Link className="text-light text-decoration-none" to="/courses">Courses</Link></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact Us</h5>
            <p>Email: support@resumepro.com</p>
            <p>Phone: +91 98765 43210</p>
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
