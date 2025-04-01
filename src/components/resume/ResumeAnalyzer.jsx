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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or DOC/DOCX file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setResume(file);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset state
    setError('');
    setAnalysis(null);
    setLoading(true);

    try {
      // Validate inputs
      if (!resume) {
        throw new Error('Please upload a resume file');
      }
      if (!jobDescription.trim()) {
        throw new Error('Please provide a job description');
      }

      // Create FormData
      const formData = new FormData();
      formData.append('resume', resume);
      formData.append('job_description', jobDescription);

      // Call API
      const result = await analyzeResume(formData);
      
      // Validate response
      if (!result || typeof result.ats_score !== 'number') {
        throw new Error('Invalid response from server');
      }

      // Format and set analysis results
      setAnalysis({
        ats_score: Math.min(Math.max(0, result.ats_score), 100),
        keywords: result.keywords || [],
        suggestions: result.suggestions || [],
        missing_keywords: result.missing_keywords || [],
        score_breakdown: result.score_breakdown || {}
      });

    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze resume. Please try again.');
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
              
              {error && (
                <Alert variant="danger" onClose={() => setError('')} dismissible>
                  {error}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Upload Resume (PDF/DOCX)</Form.Label>
                  <Form.Control 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    onChange={handleFileUpload} 
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
                    required 
                  />
                </Form.Group>
                
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" className="me-2" />
                      Analyzing...
                    </>
                  ) : 'Analyze Resume'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
          
          {analysis && (
            <Card className="shadow-sm">
              <Card.Body>
                <h3 className="text-center mb-4">Analysis Results</h3>
                
                <h4>ATS Match Score: {analysis.ats_score}%</h4>
                <ProgressBar 
                  now={analysis.ats_score} 
                  label={`${analysis.ats_score}%`} 
                  animated 
                  className="mb-4"
                  variant={
                    analysis.ats_score >= 80 ? 'success' :
                    analysis.ats_score >= 60 ? 'warning' : 'danger'
                  }
                />
                
                {analysis.keywords.length > 0 && (
                  <div className="mb-4">
                    <h4>Matching Keywords</h4>
                    <div>
                      {analysis.keywords.map((kw, i) => (
                        <Badge key={i} bg="success" pill className="me-2 mb-2">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {analysis.missing_keywords.length > 0 && (
                  <div className="mb-4">
                    <h4>Missing Keywords</h4>
                    <div>
                      {analysis.missing_keywords.map((kw, i) => (
                        <Badge key={i} bg="warning" pill className="me-2 mb-2">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {analysis.suggestions.length > 0 && (
                  <div>
                    <h4>Improvement Suggestions</h4>
                    <ListGroup>
                      {analysis.suggestions.map((sug, i) => (
                        <ListGroup.Item key={i}>{sug}</ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ResumeAnalyzer;