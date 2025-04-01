import React, { useState } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Alert, 
  Spinner,
  Badge 
} from 'react-bootstrap';
import { recommendCourses } from '../../services/jobService';

const CourseRecommendation = () => {
  const [resume, setResume] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setResume(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      setResumeText(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!resumeText.trim()) {
      setError('Please upload a resume or enter resume text');
      return;
    }

    setLoading(true);
    setError('');
    setCourses([]);

    try {
      const result = await recommendCourses(resumeText);
      
      if (result.success) {
        const recommendedCourses = result.courses || [];
        setCourses(recommendedCourses);

        if (recommendedCourses.length === 0) {
          setError('No courses could be recommended based on your resume');
        }
      } else {
        setError(result.error || 'Course recommendation failed');
        setCourses(result.courses || []);
      }
    } catch (err) {
      setError('An unexpected error occurred while recommending courses');
      console.error('Recommendation error:', err);
    } finally {
      setLoading(false);
    }
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
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Or Paste Resume Text</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={4} 
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume text here..."
                  />
                </Form.Group>

                {error && <Alert variant="danger">{error}</Alert>}

                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={loading}
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
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          {courses.length > 0 && (
            <Card>
              <Card.Header>Recommended Courses</Card.Header>
              <Card.Body>
                {courses.map((course, index) => (
                  <Card key={index} className="mb-3">
                    <Card.Body>
                      <Card.Title>{course.title}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {course.platform}
                      </Card.Subtitle>
                      <Card.Text>{course.description}</Card.Text>
                      <div className="d-flex justify-content-between mb-2">
                        <Badge bg="info">{course.skill_category}</Badge>
                        <Badge bg="success">{course.duration}</Badge>
                      </div>
                      <Button 
                        variant="outline-primary" 
                        href={course.url} 
                        target="_blank" 
                        className="w-100"
                      >
                        View Course Details
                      </Button>
                    </Card.Body>
                  </Card>
                ))}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CourseRecommendation;