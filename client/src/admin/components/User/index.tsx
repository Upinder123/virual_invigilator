import React from 'react';
import { Accordion, Card, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const UserPanel = () => (
  <>
    <Container className="panel-container">
      <Accordion className="mt-5 panel-accordion mx-auto">
        <Card>
          <Link to="/admin/user/new" className="card-header">
            Create a New user
          </Link>
        </Card>
        <Card>
          <Link to="#" className="card-header">
            Edit/Delete a User
          </Link>
        </Card>
      </Accordion>
    </Container>
  </>
);

export default UserPanel;
