import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import WalletImage from '../../assets/dao_wallet.jpg';
import { StoicIdentity } from "ic-stoic-identity";
import { dao_8yg_backend as backend } from '../../../declarations/dao_8yg_backend';


const DAOWallet = () => {
  
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {

    //checkIdentity();

    const fetchData = async () => {
      var nftWallet = await backend.getNFTWallet();
      console.log(nftWallet);
      
      var cycles = await backend.getCycles();
      console.log(Number(cycles));
      
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const checkIdentity = async () => {
    StoicIdentity.load().then(async identity => {
      if (identity !== false) {
        //ID is a already connected wallet!
      } else {
        //No existing connection, lets make one!
        identity = await StoicIdentity.connect();
      }
      
      //Lets display the connected principal!
      console.log(identity.getPrincipal().toText());
      
      //Create an actor canister
      const actor = Actor.createActor(idlFactory, {
        agent: new HttpAgent({
          identity,
        }),
        canisterId,
      });
      
      //Disconnect after
      StoicIdentity.disconnect();
    })
  };

  return (
    isLoading ? (
      <div className="customOverlay d-flex flex-column align-items-center justify-content-center">
      <Spinner animation="border" />
      <p className='text-center mt-1'>Loading</p>
    </div>) : 
    (
      <Container className="flex-grow-1 my-5">
        <Row>
          <Col md={6}>
            <img src={WalletImage} alt="8yg" className='mt-2 mb-4' style={{ maxWidth: '100%', maxHeight: '100%', marginRight: '10px' }} />
          </Col>
          <Col md={6}>
            <Row>
              <Col md={12}>
                <h1>The DAO Wallet</h1>
                <p className='mt-4 mb-4'>A list of the DAO's NFTs will appear here soon.</p>
                <p className='mt-4 mb-4'>Filter by collection.</p>
                <p className='mt-4 mb-4'>Filter by for sale or not.</p>
                </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    )
  );
};

export default DAOWallet;
