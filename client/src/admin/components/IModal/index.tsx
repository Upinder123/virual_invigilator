import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

interface Props {
  title: string;
  content: string;
  show: boolean;
  setShow: (val: boolean) => void;
  onAccept: any;
  onClose?: () => void;
}

const IModal = ({
  title,
  content,
  show,
  setShow,
  onAccept,
  onClose,
}: Props) => {
  const handleClose = () => {
    setShow(false);
    if (onClose) onClose();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{content}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShow(false);
              onAccept();
            }}
          >
            Confirm and Proceed
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default IModal;
