import React, { useEffect, useState } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import './JustSignInUp.css';
import useFetch from '../../helper/useFetch';
import { useForm } from '../../helper/useForm';
import axios from 'axios';

function JustSignUp() {
  // const { data, loading, error } = useFetch(
  //   "http://localhost:5000/v1/api/auth/signup"
  // );
  // if (data) {
  //   console.log(data);
  // }
  // if (loading) {
  //   console.log(loading);
  // }
  // if (error) {
  //   console.log(error);
  // }

  const [{ firstName, lastName, email, password }, handleChange, setData] =
    useForm({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    });

  const handleSubmit = e => {
    e.preventDefault();
    // console.log(firstName, lastName, email, password);
    axios({
      method: 'post',
      url: 'http://localhost:5000/v1/api/auth/signin',
      data: {
        email,
        password,
      },
    });

    axios
      .post('/user', {
        firstName: 'Fred',
        lastName: 'Flintstone',
      })
      .then(response => {
        console.log(response);
        console.log('This ran');
      })
      .catch(error => {
        console.log(error);
        console.log('Catch ran');
      });
    /* when successfull */
    setData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    });
  };

  return (
    <div className="JustSignUp">
      <Card className="JustSignUp_Card" style={{ width: '20rem' }}>
        <Card.Body>
          <img
            className="image_signUp"
            src="https://static.thenounproject.com/png/6478-200.png"
            alt="Sign Up"
          />
          <Card.Title className="cardtitle">Sign Up</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formGridAddress1">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                name="firstName"
                value={firstName}
                type="text"
                placeholder="Name"
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formGridAddress1">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                name="lastName"
                value={lastName}
                type="text"
                placeholder="Name"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name="email"
                value={email}
                type="email"
                placeholder="abc@xyz.com"
                onChange={handleChange}
                required
              />
              <Form.Text className="text-muted">
                We&lsquo;ll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                value={password}
                type="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />
              <Form.Text className="text-muted">
                8-20 characters, contain upper and lower case letters, numbers,
                special characters.
              </Form.Text>
            </Form.Group>
            <div className="signIn_button">
              <Button variant="primary" type="submit">
                Sign Up
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default JustSignUp;
