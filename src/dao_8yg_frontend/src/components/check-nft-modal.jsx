import React, { useState, useEffect } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { ConnectButton, useConnect } from "@connect2ic/react";
import { useCanister } from "@connect2ic/react";


const CheckNFTModal = ({ show, onHide }) => {
  
  const [backend] = useCanister("backend");
  const { isConnected } = useConnect();

  const [checkingValidNFT, setCheckingValidNFT] = useState(true);
  const [hasValidNFT, setHasValidNFT] = useState(false);
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchData = async () => {
      await checkValidNFT();
    };
    fetchData();
  }, [isConnected, backend]);

  const checkValidNFT = async () => {
    if(!isConnected || !backend){
      return;
    }

    let symbolKey = Symbol.for('ic-agent-metadata');
    let keysCount = Object.keys(await backend[symbolKey].config.agent._identity).length > 0;
    
    if(keysCount == 0){
      return;
    }
    
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
        {!isConnected &&
          <p className='mb-4'>Please sign in to access the DAO wallet.</p>
        }
       

        {isConnected && checkingValidNFT && 
          <div className="d-flex flex-column align-items-center justify-content-center mt-3">
            <Spinner animation="border" />
            <p className='text-center mt-1'><small>Checking for 8YG NFT</small></p>
          </div>
        }
        

        {isConnected && !checkingValidNFT && !hasValidNFT &&
          <p className='mb-4'>You need an 8YG NFT to view the DAO wallet. You can purchase one <a href="https://toniq.io/marketplace/8-years-gang" target='_blank'>here</a> to get started.
          <br /><br />
          <a href="https://toniq.io/marketplace/8-years-gang" target='_blank'>https://toniq.io/marketplace/8-years-gang</a>
          </p>
          
          
        }
      
      </Modal.Body>
      <Modal.Footer>
        {!isConnected &&
        <ConnectButton onClick={async (event) => {
          event.preventDefault();
          onHide();
          // Some delay may be needed to let the onHide action to finish
          await new Promise(resolve => setTimeout(resolve, 500));
          event.target.click();
        }} />
        }
      </Modal.Footer>
    </Modal>
  );
};

export default CheckNFTModal;
