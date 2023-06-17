import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { useCanister } from "@connect2ic/react";

const UpdateUsernameModal = ({ show, onHide, username }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [backend] = useCanister("backend");
    const [newUsername, setNewUsername] = useState(username);
    const [usernameError, setUsernameError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(username == newUsername){
            hideModal();
            return;
        }
        
        setIsLoading(true);
        let validUsername = await isUsernameValid();
        
        if (!validUsername) {
            setIsLoading(false);
            return;
        }
        
        await backend.updateUsername(newUsername);
        
        setNewUsername('');
        setUsernameError(null);
        onHide(true);
    };

    const isUsernameValid = async () => {
        
        const isValid = await backend.isUsernameValid(newUsername);
    
        if (isValid) {
            setUsernameError(null);
        } else {
            setUsernameError('Username name must be between 3 and 20 characters long, no special characters and not already taken.');
        }
    
        return isValid;
    };

    const hideModal = () => {
        setNewUsername(username);
        setUsernameError(null);
        onHide(false);
    };

    return (
        <Modal show={show} onHide={hideModal}>
            {isLoading && (
                <div className="customOverlay d-flex flex-column align-items-center justify-content-center">
                <Spinner animation="border" />
                <p className='text-center mt-1'>Saving Username</p>
                </div>
            )}
            <Modal.Header closeButton>
                <Modal.Title>Set Username</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter username"
                            value={newUsername}
                            onChange={(event) => setNewUsername(event.target.value)}
                        />
                        {usernameError && <Form.Text className="text-danger">{usernameError}</Form.Text>}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={hideModal}>Cancel</Button>
                <Button className="custom-button" onClick={handleSubmit}>Save</Button>
            </Modal.Footer>
        </Modal>
        
    );
};

export default UpdateUsernameModal;
