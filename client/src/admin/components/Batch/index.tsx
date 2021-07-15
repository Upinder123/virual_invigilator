import React from 'react';
import { Accordion, Card, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const BatchPanel = () => (
  <>
    <Container className="panel-container">
      <Accordion className="mt-5 panel-accordion mx-auto">
        <Card>
          <Link to="/admin/batch/new" className="card-header">
            Create a New Batch
          </Link>
        </Card>
        <Card>
          <Link to="/admin/batch/user/new" className="card-header">
            Add a User to a Batch
          </Link>
        </Card>
        <Card>
          <Link to="/admin/batch/user/new" className="card-header">
            Add a Subject to a Batch
          </Link>
        </Card>
        <Card>
          <Link to="#" className="card-header">
            Edit/Delete a Batch
          </Link>
        </Card>
      </Accordion>
    </Container>
  </>
);

export default BatchPanel;
