import React, { useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { dao_8yg_backend as backend } from '../../../../declarations/dao_8yg_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../../contexts/AuthContext";

const DeleteCollectionModal = ({ show, onHide, setIsLoading, collectionToDelete }) => {

  const { identity } = useContext(AuthContext);
  
  const handleSubmit = async () => {
    setIsLoading(true);

    Actor.agentOf(backend).replaceIdentity(identity);
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
