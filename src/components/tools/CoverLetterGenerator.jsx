import React, { useState } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Alert, 
  Spinner
} from 'react-bootstrap';
import { generateCoverLetter } from '../../services/jobService';

const CoverLetterGenerator = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!resumeText.trim() || resumeText.trim().length < 50) {
      setError('Resume text is too short or empty');
      return;
    }

    if (!jobDescription.trim() || jobDescription.trim().length < 50) {
      setError('Job description is too short or empty');
      return;
    }

    setLoading(true);
    setError('');
    setCoverLetter('');

    try {
      const result = await generateCoverLetter(resumeText, jobDescription);
      setCoverLetter(result.cover_letter);
    } catch (err) {
      setError(err.message || 'Failed to generate cover letter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h2 className="text-center mb-4">Cover Letter Generator</h2>
              {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Resume Text</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={5} 
                    value={resumeText} 
                    onChange={(e) => setResumeText(e.target.value)} 
                    placeholder="Paste your resume text here..."
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Job Description</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={5} 
                    value={jobDescription} 
                    onChange={(e) => setJobDescription(e.target.value)} 
                    placeholder="Paste the job description here..."
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? <Spinner as="span" animation="border" size="sm" className="me-2" /> : 'Generate Cover Letter'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
          {coverLetter && (
            <Card className="shadow-sm">
              <Card.Body>
                <h3 className="text-center mb-4">Generated Cover Letter</h3>
                <div className="p-3 bg-light rounded">
                  {coverLetter.split('\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
                <Button 
                  variant="success" 
                  className="mt-3"
                  onClick={() => navigator.clipboard.writeText(coverLetter)}
                >
                  Copy to Clipboard
                </Button>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CoverLetterGenerator;