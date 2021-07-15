import React from 'react';
import { Alert } from 'react-bootstrap';

interface Props {
  msg: string;
  showAlert: boolean;
  close: any;
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'dark'
    | 'light';
}

const IAlert = ({ msg, showAlert, close, variant }: Props) => (
  <Alert
    hidden={!showAlert || false}
    variant={variant || 'danger'}
    onClose={close}
    dismissible
  >
    {msg}
  </Alert>
);

export default IAlert;
