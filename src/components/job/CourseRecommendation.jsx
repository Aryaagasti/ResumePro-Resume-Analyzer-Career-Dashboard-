import React, { useState } from 'react';
import { 
  Container, Row, Col, Card, Form, 
  Button, Alert, Spinner, Badge 
} from 'react-bootstrap';

const CourseRecommendation = ({ token }) => {
  const [resume, setResume] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setResume(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setResumeText(text);
      setCharacterCount(text.length);
    };
    reader.onerror = () => {
      setError('Failed to read file');
      setResumeText('');
      setCharacterCount(0);
    };
    reader.readAsText(file);
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    setResumeText(text);
    setCharacterCount(text.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedText = resumeText.trim();
    if (!trimmedText || trimmedText.length < 50) {
      setError('Please upload a resume or enter at least 50 characters of resume text');
      return;
    }

    setLoading(true);
    setError('');
    setCourses([]);

    try {
      const response = await fetch('https://finalyearmcabackend.onrender.com/api/course/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ resume_text: trimmedText }), // Changed to match backend expectation
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to get course recommendations');
      }

      if (result.success) {
        // Ensure courses array exists and has items
        const recommendedCourses = result.courses?.length > 0 
          ? result.courses 
          : getDefaultCourses();
        
        setCourses(recommendedCourses);
        
        if (recommendedCourses.length === 0) {
          setError('No courses could be recommended based on your resume');
        }
      } else {
        setError(result.error || 'Failed to process your request');
        setCourses(getDefaultCourses()); // Fallback to default courses
      }
    } catch (err) {
      console.error('Recommendation error:', err);
      setError(err.message || 'An error occurred while getting recommendations');
      setCourses(getDefaultCourses()); // Fallback to default courses
    } finally {
      setLoading(false);
    }
  };

  // Default courses fallback (similar to your backend)
  const getDefaultCourses = () => {
    return [
      {
        title: "Professional Skills Enhancement",
        platform: "Coursera",
        description: "A comprehensive course to improve professional skills",
        skill_category: "Professional Development",
        duration: "3-4 months",
        url: "https://www.coursera.org/professional-skills"
      },
      {
        title: "Technical Skills Masterclass",
        platform: "Udemy",
        description: "Advanced technical skills for modern professionals",
        skill_category: "Technical Skills",
        duration: "2-3 months",
        url: "https://www.udemy.com/technical-skills"
      }
    ];
  };

  return (
    <Container fluid className="course-recommendation">
      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>Course Recommendation</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Upload Resume</Form.Label>
                  <Form.Control 
                    type="file" 
                    accept=".pdf,.doc,.docx,.txt" 
                    onChange={handleFileUpload} 
                  />
                  <Form.Text className="text-muted">
                    Supported formats: PDF, DOC, DOCX, TXT
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Or Paste Resume Text</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={8} 
                    value={resumeText}
                    onChange={handleTextChange}
                    placeholder="Paste your resume text here..."
                  />
                  <Form.Text className={`text-muted ${characterCount < 50 ? 'text-danger' : ''}`}>
                    {characterCount < 50 
                      ? `Minimum 50 characters required (${50 - characterCount} more needed)`
                      : `${characterCount} characters entered (ready to submit)`}
                  </Form.Text>
                </Form.Group>

                {error && (
                  <Alert variant="danger" onClose={() => setError('')} dismissible>
                    {error}
                  </Alert>
                )}

                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading || characterCount < 50}
                  >
                    {loading ? (
                      <>
                        <Spinner 
                          as="span"
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Generating Recommendations...
                      </>
                    ) : (
                      'Get Course Recommendations'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>Recommended Courses</Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Analyzing your resume and generating recommendations...</p>
                </div>
              ) : courses.length > 0 ? (
                courses.map((course, index) => (
                  <Card key={index} className="mb-3">
                    <Card.Body>
                      <Card.Title>{course.title || 'Untitled Course'}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {course.platform || 'Unknown Platform'}
                      </Card.Subtitle>
                      <Card.Text>
                        {course.description || 'No description available'}
                      </Card.Text>
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        <Badge bg="info" className="me-2">
                          {course.skill_category || 'General Skills'}
                        </Badge>
                        <Badge bg="success">
                          {course.duration || 'Duration not specified'}
                        </Badge>
                      </div>
                      {course.url && (
                        <Button 
                          variant="outline-primary" 
                          href={course.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-100"
                        >
                          View Course
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <Alert variant="info">
                  {error 
                    ? 'Could not generate recommendations. Please try again.'
                    : 'No courses to display. Upload your resume or paste resume text to get recommendations.'}
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CourseRecommendation;
