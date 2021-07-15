/* eslint-disable react/jsx-filename-extension */
import React from 'react'
import { Spinner } from "react-bootstrap";

export const spinner = (
  <Spinner className="d-flex mx-auto" animation="border" role="status" variant="dark">
    <span className="sr-only">Loading...</span>
  </Spinner>
)
