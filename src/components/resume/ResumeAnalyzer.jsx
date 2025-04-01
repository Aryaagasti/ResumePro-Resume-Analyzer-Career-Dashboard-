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
  ProgressBar, 
  Badge,
  ListGroup
} from 'react-bootstrap';
import { analyzeResume } from '../../services/resumeService';

const ResumeAnalyzer = () => {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const cleanText = (text) => text.replace(/\*\*/g, '');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or DOC/DOCX file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setResume(file);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) {
      setError('Please upload a resume file');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please provide a job description');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const result = await analyzeResume(resume, jobDescription);
      
      const validatedAnalysis = {
        ats_score: Math.min(Math.max(0, result?.ats_score || 0), 100),
        keywords: result?.keywords?.map(cleanText) || [],
        suggestions: result?.suggestions?.map(cleanText) || [],
        missing_keywords: result?.missing_keywords?.map(cleanText) || [],
        score_breakdown: {
          skills_match: Math.min(Math.max(0, result?.score_breakdown?.skills_match || 0), 1),
          experience_match: Math.min(Math.max(0, result?.score_breakdown?.experience_match || 0), 1)
        }
      };
      
      setAnalysis(validatedAnalysis);
    } catch (err) {
      let errorMessage = 'Failed to analyze the resume. Please try again.';
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Please login to use this feature';
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
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
              <h2 className="text-center mb-4">Resume Analyzer</h2>
              {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Upload Resume (PDF/DOCX)</Form.Label>
                  <Form.Control type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Job Description</Form.Label>
                  <Form.Control as="textarea" rows={5} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} required />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? <Spinner as="span" animation="border" size="sm" className="me-2" /> : 'Analyze Resume'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
          {analysis && (
            <Card className="shadow-sm">
              <Card.Body>
                <h3 className="text-center mb-4">Analysis Results</h3>
                <h4>ATS Match Score: {analysis.ats_score}%</h4>
                <ProgressBar now={analysis.ats_score} label={`${analysis.ats_score}%`} animated className="mb-2" />
                {analysis.keywords.length > 0 && <div><h4>Matching Keywords</h4>{analysis.keywords.map((kw, i) => <Badge key={i} bg="success" pill>{kw}</Badge>)}</div>}
                {analysis.missing_keywords.length > 0 && <div><h4>Missing Keywords</h4>{analysis.missing_keywords.map((kw, i) => <Badge key={i} bg="warning" pill>{kw}</Badge>)}</div>}
                {analysis.suggestions.length > 0 && <div><h4>Improvement Suggestions</h4><ListGroup>{analysis.suggestions.map((sug, i) => <ListGroup.Item key={i}>{sug}</ListGroup.Item>)}</ListGroup></div>}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ResumeAnalyzer;