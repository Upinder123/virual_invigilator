import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const clearToken = () => {
  const TOKEN_KEY = process.env.REACT_APP_TOKEN_KEY;
  if (TOKEN_KEY) localStorage.removeItem(TOKEN_KEY);
  else
    throw new Error(
      'No token key in env var, add REACT_APP_TOKEN_KEY to /src/.env'
    );
};

const AdminDashboard = () => {
  const history = useHistory();

  const logout = () => {
    clearToken();
    history.push('/admin');
  };

  return (
    <>
      <Container>
        <Button variant="link" onClick={logout}>
          Logout
        </Button>
        Welcome to dashboard!
      </Container>
    </>
  );
};

export default AdminDashboard;
