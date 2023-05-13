import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import AuctionImage from '../../assets/8YGAuction.jpg';
import CheckNFTModal from './check-nft-modal';

const Home = () => {
  
  const [isLoading, setIsLoading] = useState(true);
  const [showCheckWalletModal, setShowCheckWalletModal] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const hideCheckWalletModal = async () => {
    setShowCheckWalletModal(false); 
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
            <img src={AuctionImage} alt="8yg" className='mt-2 mb-4' style={{ maxWidth: '100%', maxHeight: '100%', marginRight: '10px' }} />
          </Col>
          <Col md={6}>
            <Row>
              <Col md={12}>
                <h1>Welcome</h1>
                <p className='mt-4 mb-4'>8 Years Gang NFT holders will be able to stake their NFTs within this DAO. Initially this will enable them to participate in governance of the 8YG wallet and receive rewards based on the DAO's profit.</p>
                
                <Button className="btn btn-sm mt-3 mb-4" onClick={() => setShowCheckWalletModal(true)}>View 8YG Wallet</Button>
                
                <p className='mb-4'>We aim to introduce various mechanisms to maximise the rewards associated with the gang members you own, check back here in the future for further updates.</p>
                
              </Col>
            </Row>
          </Col>
        </Row>

{showCheckWalletModal && 
        <CheckNFTModal
          show={showCheckWalletModal}
          onHide={hideCheckWalletModal}
        />

}

      </Container>

      

    )
  );
};

export default Home;
