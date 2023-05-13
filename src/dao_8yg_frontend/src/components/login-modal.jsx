import React, { useContext, useState, useEffect } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { dao_8yg_backend as backend } from '../../../declarations/dao_8yg_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const CheckNFTModal = ({ show, onHide }) => {

  const { login} = useContext(AuthContext);
  
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Checking for 8YG NFT</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        
      </Modal.Body>
      <Modal.Footer>
          <Button onClick={() => { login(); }} className="btn btn-sm mb-4">Sign In To Access</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CheckNFTModal;
