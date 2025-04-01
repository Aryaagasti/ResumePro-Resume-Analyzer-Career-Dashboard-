import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, ListGroup } from 'react-bootstrap';
import { FiMessageSquare, FiX } from 'react-icons/fi';
import { askQuestion } from '../../services/chatbotService';

const Chatbot = () => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Function to clean up the response text
  const cleanResponse = (text) => {
    if (!text) return '';
    
    // Remove markdown characters like *, #, etc.
    let cleaned = text.replace(/\*/g, '')
                     .replace(/#/g, '')
                     .replace(/```/g, '');
    
    // Convert markdown links to HTML links
    cleaned = cleaned.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Convert line breaks to HTML breaks
    cleaned = cleaned.replace(/\n/g, '<br/>');
    
    return cleaned;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
  
    const userMessage = { sender: 'user', text: message };
    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);
  
    try {
      const response = await askQuestion(message);
      const cleanedAnswer = cleanResponse(response.answer);
      
      const botMessage = { 
        sender: 'bot', 
        text: cleanedAnswer,
        resources: response.resources 
      };
      setConversation(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setConversation(prev => [...prev, { 
        sender: 'bot', 
        text: error.message || "Sorry, I'm having trouble. Please try again later." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      setConversation([{
        sender: 'bot',
        text: `Hi there! 👋 I'm your Career Bhaiya/Didi. Ask me anything about:<br/>
        - Resume building (80+ ATS score tips)<br/>
        - Career guidance<br/>
        - Interview prep<br/>
        - Course recommendations<br/>
        - Job search strategies<br/><br/>
        I'll help you with honest advice and free resources!`
      }]);
    }
  }, [show]);

  // Function to render text with HTML breaks
  const renderTextWithBreaks = (text) => {
    return <div dangerouslySetInnerHTML={{ __html: text }} />;
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000
    }}>
      <Button 
        variant="primary" 
        onClick={handleShow}
        style={{
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '24px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}
      >
        <FiMessageSquare />
      </Button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header className="bg-primary text-white">
          <Modal.Title>Career Advisor 🤵</Modal.Title>
          <Button variant="link" onClick={handleClose} className="text-white">
            <FiX size={24} />
          </Button>
        </Modal.Header>
        <Modal.Body style={{ height: '400px', overflowY: 'auto' }}>
          <div className="chat-container">
            {conversation.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-3 ${msg.sender === 'user' ? 'text-end' : 'text-start'}`}
              >
                <div 
                  className={`d-inline-block p-3 rounded ${msg.sender === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-light text-dark'}`}
                >
                  {renderTextWithBreaks(msg.text)}
                  {msg.resources && (
                    <div className="mt-2">
                      <h6>Helpful Resources:</h6>
                      <ListGroup>
                        {Object.entries(msg.resources).map(([key, url]) => (
                          <ListGroup.Item key={key}>
                            <a href={url} target="_blank" rel="noopener noreferrer">
                              {key.replace('_', ' ')} →
                            </a>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-center">
                <Spinner animation="border" variant="primary" />
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Form onSubmit={handleSubmit} className="w-100">
            <Form.Group className="d-flex">
              <Form.Control
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about careers, resumes, jobs..."
                disabled={loading}
              />
              <Button variant="primary" type="submit" disabled={loading}>
                Send
              </Button>
            </Form.Group>
          </Form>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Chatbot;