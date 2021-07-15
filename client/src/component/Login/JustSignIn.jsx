import React, { useState } from "react";
import { Button, Form, Card } from "react-bootstrap";
import { Redirect, BrowserRouter, useHistory } from "react-router-dom";
import "./JustSignInUp.css";
import { useForm } from "../../helper/useForm";
import axios from "axios";

function JustSignIn() {
  const history = useHistory();
  const [error, seterror] = useState("");
  const [{ email, password }, handleChange, setData] = useForm({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    seterror("");
    axios
      .post("http://localhost:5000/v1/api/auth/signin", {
        email,
        password,
      })
      .then((response) => {
        setData({
          email: "",
          password: "",
        });
        console.log(response);
        console.log("This ran");
          <Redirect to="/" />;
        localStorage.setItem("userDetail", JSON.stringify(response.data));
      })
      .catch((e) => {
        console.log(e.response);
        console.log("Catch ran");
        seterror(e.response.data.error.message);
        console.log(e.response.data.error.message);
      });
  };

  return (
    <div className="JustSignIn">
      <Card className="JustSignIn_Card" style={{ width: "20rem" }}>
        <Card.Body>
          <img
            className="image_signIn"
            src="https://cdn1.iconfinder.com/data/icons/arrows-vol-1-4/24/login_circle-512.png"
            alt="Not Found"
          />
          <Card.Title className="cardtitle">Sign In</Card.Title>
          <Form onSubmit={handleSubmit}>
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
                Don&lsquo;t share you&lsquo;re Password.
              </Form.Text>
            </Form.Group>
            {error && (
              <div
                style={{
                  marginTop: ".25rem",
                  fontSize: "100%",
                  color: "#dc3545",
                }}
              >
                {error}
              </div>
            )}
            <Form.Group controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Remember Me" />
            </Form.Group>
            <div className="signIn_button">
              {/* onClick={() => history.push("/")} */}
              {/* This dosn't work the way it should. */}
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default JustSignIn;
