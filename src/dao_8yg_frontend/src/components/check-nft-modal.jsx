import React, { useContext, useState, useEffect } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { dao_8yg_backend as backend } from '../../../declarations/dao_8yg_backend';
import { Actor } from "@dfinity/agent";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const CheckNFTModal = ({ show, onHide }) => {

  const [checkingValidNFT, setCheckingValidNFT] = useState(true);
  const [hasValidNFT, setHasValidNFT] = useState(false);
  const { isAuthenticated, login, identity } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await checkValidNFT();
    };
    fetchData();
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      await checkValidNFT();
    };
    fetchData();
  }, [isAuthenticated]);

  const checkValidNFT = async () => {
    if(!isAuthenticated){
      return;
    }
    Actor.agentOf(backend).replaceIdentity(identity);
    const valid = await backend.hasValidNFT();
    setHasValidNFT(valid);
    setCheckingValidNFT(false);
    if(valid){
      navigate("/DAOWallet");
    }
  };
  

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Checking for 8YG NFT</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isAuthenticated &&
          <p className='mb-4'>Please sign in to access the DAO wallet.</p>
        }
       

        {isAuthenticated && checkingValidNFT && 
          <div className="d-flex flex-column align-items-center justify-content-center mt-3">
            <Spinner animation="border" />
            <p className='text-center mt-1'><small>Checking for 8YG NFT</small></p>
          </div>
        }
        

        {isAuthenticated && !checkingValidNFT && !hasValidNFT &&
          <p className='mb-4'>You need an 8YG NFT to view the DAO wallet. You can purchase one <a href="https://toniq.io/marketplace/8-years-gang" target='_blank'>here</a> to get started.
          <br /><br />
          <a href="https://toniq.io/marketplace/8-years-gang" target='_blank'>https://toniq.io/marketplace/8-years-gang</a>
          </p>
          
          
        }
      
      </Modal.Body>
      <Modal.Footer>
        {!isAuthenticated &&
          <Button onClick={() => { login(); }} className="btn btn-sm mb-4">Sign In To Access</Button>
        }
      </Modal.Footer>
    </Modal>
  );
};

export default CheckNFTModal;
