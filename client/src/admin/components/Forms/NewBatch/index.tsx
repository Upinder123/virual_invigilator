import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import { validateEmail } from '../../../../helper/validateEmail';
import { useForm } from '../../../../helper/useForm';
import IAlert from '../../IAlert';
import AdminDatePicker from './AdminDatePicker';
import { addDays } from '../../../../helper/addDays';
// import SelectRoles from './SelectRoles';

const NewUser = () => {
  const [formData, setFormData, setData] = useForm({
    name: '',
  });
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState<Date | null | undefined>();
  const [endDate, setEndDate] = useState<Date | null | undefined>();

  const [success, setSuccess] = useState('');

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(!validateEmail(formData.email) ? 'Email entered is invalid' : '');

    setError(
      !startDate || !endDate ? 'Start and End Dates are mandatory!' : ''
    );
    if (!startDate || !endDate) return;

    console.log('form submit');

    axios
      .post('http://localhost:5000/v1/api/batch', {
        name: formData.name,
        start: startDate,
        end: endDate,
      })
      .then(r => {
        const response = r.data;
        console.log(response);

        if ('error' in response) setError(response.error.message);
        else {
          setSuccess(`Successfully created Batch ${formData.name}`);
          setData({ name: '' });
          setStartDate(null);
          setEndDate(null);
        }
      })
      .catch(e => {
        console.log(e.response);
        setError(
          e.response.status === 500
            ? 'Something went wrong, please try again'
            : e.response.data.error.message
        );
      });
  };
  // console.log(formData);
  // console.log(error);

  return (
    <>
      <h1 className="d-flex justify-content-center mt-5">New Batch Form</h1>
      <Container>
        <Row className="justify-content-center">
          <Col xs={10} md={5} lg={5}>
            <IAlert
              msg={error}
              showAlert={!!error}
              close={() => setError('')}
            />

            <IAlert
              msg={success}
              showAlert={!!success}
              close={() => setSuccess('')}
              variant="success"
            />

            <Form className="" onSubmit={handleLogin}>
              <Form.Group controlId="formBasicBatchName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="name"
                  placeholder="Enter Batch Name"
                  name="name"
                  value={formData.name}
                  onChange={e => {
                    setError('');
                    setFormData(e);
                  }}
                  autoFocus
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBasicStartDate">
                <Form.Label>Start</Form.Label>
                <AdminDatePicker
                  daysForMaxDate={60}
                  daysForMinDate={2}
                  date={startDate}
                  setDate={setStartDate}
                  name="start"
                />
              </Form.Group>
              <Form.Group controlId="formBasicEndDate">
                <Form.Label>End</Form.Label>
                <AdminDatePicker
                  daysForMaxDate={200}
                  daysForMinDate={60}
                  date={endDate}
                  setDate={setEndDate}
                  name="end"
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default NewUser;
