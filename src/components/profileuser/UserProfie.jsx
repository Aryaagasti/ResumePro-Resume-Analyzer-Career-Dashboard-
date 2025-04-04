import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Alert, Modal } from 'react-bootstrap';
import { getUserProfile, updateUserProfile, deleteResume } from '../../services/userService';
import { isTokenExpired, getToken } from '../../utils/tokenUtils'; // Import token utils
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', email: '', currentPassword: '', newPassword: '' });
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token validity
    if (!getToken() || isTokenExpired()) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await getUserProfile(); // Fetch profile via API
        setUserDetails(response.user);
        setResumes(response.resumes);
      } catch (error) {
        console.error('Failed to fetch profile details:', error);
        setError('Failed to load user profile.');
        navigate('/login');
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleUpdateProfile = async () => {
    try {
      await updateUserProfile(profileData);
      setUserDetails({ ...userDetails, ...profileData }); // Update local state
      setShowEditModal(false); // Close modal after successful update
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Failed to update profile.');
    }
  };

  const handleDeleteResume = async (resumeId) => {
    try {
      await deleteResume(resumeId);
      setResumes(resumes.filter((resume) => resume.resumeId !== resumeId));
    } catch (error) {
      console.error('Failed to delete resume:', error);
      setError('Failed to delete resume.');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col className="text-center">
          <h2 className="fw-bold">MyProfile</h2>
          <p>Manage your account and resumes</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {userDetails && (
        <Card className="mb-5 shadow">
          <Card.Body>
            <h4 className="fw-bold">{userDetails.fullName}</h4>
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Total Resumes Uploaded:</strong> {userDetails.resumeCount}</p>
            <Button variant="primary" onClick={() => setShowEditModal(true)}>Edit Profile</Button>
          </Card.Body>
        </Card>
      )}

      <Row>
        <Col>
          <h4 className="fw-bold mb-3">Uploaded Resumes</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>File Name</th>
                <th>Uploaded At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resumes.map((resume, index) => (
                <tr key={resume.resumeId}>
                  <td>{index + 1}</td>
                  <td>{resume.fileName}</td>
                  <td>{resume.createdAt}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteResume(resume.resumeId)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Edit Profile Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={profileData.name || userDetails?.fullName || ''}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={profileData.email || userDetails?.email || ''}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                value={profileData.currentPassword}
                onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={profileData.newPassword}
                onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleUpdateProfile}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserProfile;
