import React, { useContext, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { dao_8yg_backend as backend } from '../../../../declarations/dao_8yg_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../../contexts/AuthContext";

const CreateCollectionModal = ({ show, onHide, setIsLoading }) => {

  const { identity } = useContext(AuthContext);
  const [canisterId, setCanisterId] = useState('');
  const [collectionName, setCollectionName] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    Actor.agentOf(backend).replaceIdentity(identity);
    await backend.createCollection(collectionName, canisterId);
    
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Collection</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="collectionName">
            <Form.Label>Collection Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter collection name"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="canisterId">
            <Form.Label>Canister Id</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter canister Id"
              value={canisterId}
              onChange={(e) => setCanisterId(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button onClick={handleSubmit}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateCollectionModal;
