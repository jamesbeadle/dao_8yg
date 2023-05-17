import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useCanister } from "@connect2ic/react";

const DeleteCollectionModal = ({ show, onHide, setIsLoading, collectionToDelete }) => {
  
  const [backend] = useCanister("backend");
  
  const handleSubmit = async () => {
    setIsLoading(true);

    await backend.deleteCollection(collectionToDelete);

    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Collection</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this collection?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="danger" onClick={handleSubmit}>Delete</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteCollectionModal;
