import { React, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { Link } from 'react-router-dom'
import "./alert.css";

export default function CheatingAlert({ variant, detail, setWatch, setCheatingCount }) {
  const [show, setShow] = useState(true);

  const messageContent = {
    warning: (
      <>
        <Alert.Heading>Warning</Alert.Heading>
        <p>
          You've been found as cheating. If you continue this behaviour, you
          will be disqualified.
        </p>
        <p>Reason: {detail}</p>
        <div className="sr-only">You&aposve been found cheating</div>
      </>
    ),
    danger: (
      <>
        <Alert.Heading>You have been disqualified</Alert.Heading>
        <p>
          We found that you are consistently trying to cheat, which is against
          the conditions that you accepted before taking this trivia. This is
          supposed to be a fun activity. Cheating will do no good to you.
        </p>
        <p>Reason: {detail}</p>
        <div className="sr-only">You have been disqualified</div>
        <Link className="btn go-to-btn" to="/">Go to Home</Link>
      </>
    ),
  };

  console.log(variant);

  if (show) {
    return (
      <>
        <div className="cheating-notification-container">
          <Alert
            variant={variant}
            onClose={() => {
              setShow(false);
              setWatch({
                watching: true,
                variant: null,
                detail: null,
                cheating: false,
              });
              variant === "danger" && setCheatingCount(0);
            }}
            dismissible={variant === "warning"}
          >
            {messageContent[variant]}
          </Alert>
        </div>
      </>
    );
  }
  return <Button onClick={() => setShow(true)}>Show Alert</Button>;
}
