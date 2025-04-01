import React, { useState } from 'react';
import { 
  Container, Row, Col, Card, Form, 
  Button, Alert, Spinner, Modal
} from 'react-bootstrap';

const CoverLetterGenerator = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    setCoverLetter('');
    
    if (!resumeText.trim() || resumeText.trim().length < 50) {
      setError('Resume text must be at least 50 characters');
      return;
    }

    if (!jobDescription.trim() || jobDescription.trim().length < 50) {
      setError('Job description must be at least 50 characters');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://finalyearmcabackend.onrender.com/api/cover-letter/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ resume_text: resumeText, job_description: jobDescription })
      });

      const result = await response.json();
      
      if (response.ok) {
        setCoverLetter(result.cover_letter);
        setShowModal(true);
      } else {
        setError(result.error || 'Failed to generate cover letter');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while generating the cover letter');
      if (err.message.includes('Authentication') || err.message.includes('log in')) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter)
      .then(() => alert('Cover letter copied to clipboard!'))
      .catch(() => alert('Failed to copy cover letter'));
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([coverLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'cover_letter.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
                  <Form.Label>Resume Text (minimum 50 characters)</Form.Label>
                  <Form.Control as="textarea" rows={8} value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Paste your resume text here..." required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Job Description (minimum 50 characters)</Form.Label>
                  <Form.Control as="textarea" rows={8} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the job description here..." required />
                </Form.Group>
                <div className="d-grid">
                  <Button variant="primary" type="submit" disabled={loading} size="lg">
                    {loading ? (<><Spinner as="span" animation="border" size="sm" className="me-2" />Generating...</>) : 'Generate Cover Letter'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Your Custom Cover Letter</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ whiteSpace: 'pre-line' }}>{coverLetter}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCopy}>Copy to Clipboard</Button>
          <Button variant="primary" onClick={handleDownload}>Download as TXT</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CoverLetterGenerator;
