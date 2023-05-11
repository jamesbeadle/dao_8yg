import React, { useContext, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { dao_8yg_backend as backend } from '../../../../declarations/dao_8yg_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../../contexts/AuthContext";

const CreateCollectionModal = ({ show, onHide, setIsLoading, editedCollection }) => {

  const { authClient } = useContext(AuthContext);
  const [canisterName, setCanisterName] = useState('');
  const [collectionName, setCollectionName] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    const identity = authClient.getIdentity();
    Actor.agentOf(backend).replaceIdentity(identity);
    await backend.updateCollection(editedCollection.id, collectionName, canisterName);
    
    onHide();
  };

  return (
    <Modal show={show} onShow={() => setCollectionName(editedCollection.name)} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Collection</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="collectionName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter collection name"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button className="custom-button" onClick={handleSubmit}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateCollectionModal;
