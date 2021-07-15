import React, { useEffect, useRef, useState } from 'react';
import { Spinner, SpinnerProps } from 'react-bootstrap';

interface Props {
  timeToShowAfter?: number;
}

const OptimisedSpinner = ({ timeToShowAfter }: Props) => {
  const DEFAULT_WAIT_TIME = 200;
  const [{ id, show }, setShow] = useState({ id: 0, show: false });

  useEffect(() => {
    const id = window.setTimeout(() => {
      setShow({ id, show: true });
      console.log(`showing after ${timeToShowAfter || DEFAULT_WAIT_TIME} ms!`);
    }, timeToShowAfter || DEFAULT_WAIT_TIME);

    return () => clearTimeout(id);
  }, [timeToShowAfter]);

  return show ? <Spinner animation="border" role="status" /> : <></>;
};

export default OptimisedSpinner;
