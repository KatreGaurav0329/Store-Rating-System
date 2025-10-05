import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container className="mt-5">
      <Alert variant="danger">
        <Alert.Heading>Unauthorized Access</Alert.Heading>
        <p>You don't have permission to access this page.</p>
        <Button variant="primary" onClick={() => navigate('/stores')}>
          Go to Stores
        </Button>
      </Alert>
    </Container>
  );
};

export default UnauthorizedPage;
