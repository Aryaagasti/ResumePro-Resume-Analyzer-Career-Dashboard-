import React, { useState } from 'react';
import axios from 'axios';
import { getToken } from '../../utils/tokenUtils'; // Ensure to import your token management utilities
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  ProgressBar,
  Badge,
  ListGroup,
  Spinner,
} from 'react-bootstrap';

const ResumeAnalyzer = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setResumeFile(event.target.files[0]);
  };

  const handleJobDescriptionChange = (event) => {
    setJobDescription(event.target.value);
  };

  const analyzeResume = async () => {
    const token = getToken(); // Retrieve token from local storage

    if (!token) {
      setError('Unauthorized: Please log in to continue.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('job_description', jobDescription);

    try {
      setLoading(true);
      const response = await axios.post('https://finalyearmcabackend.onrender.com/api/resume/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });

      setResponseData({
        atsScore: response.data.ats_score || 0,
        keywords: response.data.keywords || [],
        missingKeywords: response.data.missing_keywords || [],
        scoreBreakdown: response.data.score_breakdown || {},
        suggestions: response.data.suggestions?.map(suggestion => suggestion.replace(/\*\*/g, '')) || [],
        summary: `Resume Summary:
        1. Format and Clean Up: The resume is poorly formatted and difficult to read. Use standard resume formatting with clear sections (Summary/Objective, Skills, Experience, Education, Projects). Use proper capitalization, spacing, and punctuation. Correct email and contact information format.
        2. PHP and Frontend Frameworks: The job description emphasizes PHP and lists React, Angular, and Vue.js as preferred frontend skills. While the resume mentions Angular experience, it lacks PHP. Consider acquiring and showcasing PHP skills. Highlight Angular experience more prominently and mention version compatibility with the job requirements.
        3. Quantify Achievements: Instead of just listing tasks, quantify achievements in the professional experience and project sections. Use metrics to showcase impact. For example, instead of "enhancing team coordination," write "Improved team coordination by 20% by implementing a real-time dashboard."`,
      });
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze resume');
      setResponseData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header as="h3" className="text-center">
              Resume Analyzer
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group controlId="formResumeFile" className="mb-3">
                  <Form.Label>Upload Resume</Form.Label>
                  <Form.Control type="file" onChange={handleFileChange} />
                </Form.Group>

                <Form.Group controlId="formJobDescription" className="mb-3">
                  <Form.Label>Job Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={handleJobDescriptionChange}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  onClick={analyzeResume}
                  disabled={loading}
                  className="w-100"
                >
                  {loading ? <Spinner animation="border" size="sm" /> : 'Analyze'}
                </Button>
              </Form>

              {error && (
                <Alert variant="danger" className="mt-3">
                  {error}
                </Alert>
              )}

              {responseData && (
                <Card className="mt-4">
                  <Card.Header as="h4">Analysis Result</Card.Header>
                  <Card.Body>
                    <h5 className="mb-3">
                      ATS Score: <Badge bg="info">{responseData.atsScore}</Badge>
                    </h5>
                    <h6>Keywords Found:</h6>
                    <ListGroup className="mb-3">
                      {responseData.keywords.length > 0 ? (
                        responseData.keywords.map((keyword, index) => (
                          <ListGroup.Item key={index} variant="success">
                            {keyword}
                          </ListGroup.Item>
                        ))
                      ) : (
                        <ListGroup.Item variant="warning">
                          No keywords found.
                        </ListGroup.Item>
                      )}
                    </ListGroup>

                    <h6>Missing Keywords:</h6>
                    <ListGroup className="mb-3">
                      {responseData.missingKeywords.map((keyword, index) => (
                        <ListGroup.Item key={index} variant="danger">
                          {keyword}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>

                    <h6>Score Breakdown:</h6>
                    {Object.entries(responseData.scoreBreakdown).map(([key, value]) => (
                      <div key={key} className="mb-2">
                        <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                        <ProgressBar now={value} label={`${value}%`} className="mt-1" />
                      </div>
                    ))}

                    <h6>Suggestions:</h6>
                    <ListGroup>
                      {responseData.suggestions.map((suggestion, index) => (
                        <ListGroup.Item key={index}>{suggestion}</ListGroup.Item>
                      ))}
                    </ListGroup>

                    <h6 className="mt-3">Resume Summary:</h6>
                    <Card.Text>{responseData.summary}</Card.Text>
                  </Card.Body>
                </Card>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResumeAnalyzer;
