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
  ListGroup,
  ProgressBar,
  Badge
} from 'react-bootstrap';

const FeedbackAnalyzer = () => {
  const [feedback, setFeedback] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      setError('Please enter feedback text');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const token = localStorage.getItem('resume_pro_token');
      const response = await fetch('https://finalyearmcabackend.onrender.com/api/feedback/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ feedback })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to analyze feedback');
      }

      const result = await response.json();
      
      setAnalysis({
        sentiment: result.sentiment || 'Neutral',
        sentiment_score: result.sentiment_score || 50,
        key_points: result.key_insights || [],
        suggestions: result.improvement_areas || [],
        recommendations: result.recommendations || '',
        error: result.error
      });
    } catch (err) {
      setError(err.message || 'Failed to analyze feedback');
      if (err.message.includes('Authorization')) {
        // Handle unauthorized error
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };
  const getSentimentBadge = (sentiment) => {
    switch(sentiment?.toLowerCase()) {
      case 'positive': return 'success';
      case 'negative': return 'danger';
      default: return 'info';
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h2 className="text-center mb-4">Feedback Analyzer</h2>
              {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Feedback Text</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={5} 
                    value={feedback} 
                    onChange={(e) => setFeedback(e.target.value)} 
                    placeholder="Paste your feedback here..."
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" className="me-2" />
                      Analyzing...
                    </>
                  ) : 'Analyze Feedback'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
          
          {analysis && (
            <Card className="shadow-sm">
              <Card.Body>
                <h3 className="text-center mb-4">Analysis Results</h3>
                
                {/* Sentiment Analysis Section */}
                <div className="mb-4">
                  <h5>Sentiment Analysis</h5>
                  <div className="d-flex align-items-center mb-2">
                    <span className="me-2">Sentiment:</span>
                    <Badge pill bg={getSentimentBadge(analysis.sentiment)}>
                      {analysis.sentiment}
                    </Badge>
                  </div>
                  <div>
                    <span className="me-2">Confidence:</span>
                    <ProgressBar 
                      now={analysis.sentiment_score} 
                      label={`${analysis.sentiment_score}%`} 
                      variant={getSentimentBadge(analysis.sentiment)}
                      className="mb-3"
                    />
                  </div>
                </div>
                
                {/* Key Insights Section */}
                {analysis.key_points?.length > 0 && (
                  <div className="mb-4">
                    <h5>Key Insights</h5>
                    <ListGroup variant="flush">
                      {analysis.key_points.map((point, i) => (
                        <ListGroup.Item key={`insight-${i}`}>
                          <i className="fas fa-check-circle text-success me-2"></i>
                          {point}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                )}
                
                {/* Improvement Areas Section */}
                {analysis.suggestions?.length > 0 && (
                  <div className="mb-4">
                    <h5>Areas for Improvement</h5>
                    <ListGroup variant="flush">
                      {analysis.suggestions.map((suggestion, i) => (
                        <ListGroup.Item key={`suggestion-${i}`}>
                          <i className="fas fa-exclamation-circle text-warning me-2"></i>
                          {suggestion}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                )}
                
                {/* Recommendations Section */}
                {analysis.recommendations && (
                  <div className="mt-4 p-3 bg-light rounded">
                    <h5>Professional Recommendations</h5>
                    <p>{analysis.recommendations}</p>
                  </div>
                )}
                
                {/* Error Message (if any) */}
                {analysis.error && (
                  <Alert variant="warning" className="mt-3">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {analysis.error}
                  </Alert>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default FeedbackAnalyzer;
