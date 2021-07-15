import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from '../../../helper/useForm';
import IAlert from '../IAlert';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import useFetch from '../../../helper/useFetch';
import axios from 'axios';
import { validateEmail } from '../../../helper/validateEmail';
import checkAuth from '../../../helper/checkAuth';

export const Login = () => {
  const [formData, setFormData] = useForm({ email: '', password: '' });
  const history = useHistory();
  const location =
    useLocation<{
      auth?: boolean;
      from?: {
        pathname?: string;
      };
      error?: string;
    }>();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (checkAuth()) history.push('/admin/dashboard');
    /* 💩 */
    const e = setTimeout(() => {
      setError(
        (location.state && location.state.error && location.state.error) || ''
      );

      clearTimeout(e);
    }, 1000);
  }, []);

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(!validateEmail(formData.email) ? 'Email entered is invalid' : '');

    console.log('form submit');

    axios
      .post('http://localhost:5000/v1/api/user/signIn', {
        email: formData.email,
        password: formData.password,
      })
      .then(r => {
        const response = r.data;
        console.log(response);

        if ('error' in response) setError(response.error.message);
        else {
          if (!response.roles.includes('admin')) {
            setError('Only admins are allowed!');
            return;
          }

          const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;
          console.log(response.token);
          console.log(SECRET_KEY);

          setError(prevE =>
            !SECRET_KEY
              ? 'Something went wrong!!.. Please try again later!'
              : prevE
          );
          if (!SECRET_KEY) return;

          jwt.verify(response.token, SECRET_KEY, (err: any, decoded: any) => {
            if (err) {
              console.log(err);
              setError('Something went wrong!!.. Please try again later');
            } else {
              console.log(decoded);
              localStorage.setItem(
                `${process.env.REACT_APP_TOKEN_KEY}`,
                response.token
              );
              // props.setLoggedIn(true);
              if (
                location.state &&
                !location.state.auth &&
                location.state.from &&
                location.state.from.pathname
              )
                history.push(location.state.from.pathname);
              else history.push('/admin/dashboard');
            }
          });
        }
      })
      .catch(e => {
        console.log(e.response);
        setError(
          e.response.status === 500
            ? 'Something went wrong, please try again'
            : e.response.status === 404
            ? 'A/c not found.. please contact your administrator'
            : e.response.data.error.message
        );
      });
  };
  // console.log(formData);
  // console.log(error);

  return (
    <>
      <h1 className="d-flex justify-content-center mt-5">Admin Login</h1>
      <Container>
        <Row className="justify-content-center">
          <Col xs={10} md={5} lg={5}>
            <IAlert
              msg={error}
              showAlert={!!error}
              close={() => setError('')}
            />
            <Form className="" onSubmit={handleLogin}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={formData.email}
                  onChange={e => {
                    setError('');
                    setFormData(e);
                  }}
                  autoFocus
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={e => {
                    setError('');
                    setFormData(e);
                  }}
                  value={formData.password}
                  required
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
