import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import AuctionImage from '../../assets/8YGAuction.jpg';


const Home = () => {
  
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(false);
    };
    fetchData();
  }, []);

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
                
                <LinkContainer className="mt-3" to={`/DAOWallet`}>
                  <Button className="btn custom-button btn-sm mb-4">View 8YG Wallet</Button>
                </LinkContainer>
                
                <p className='mb-4'>We aim to introduce various mechanisms to maximise the rewards associated with the gang members you own, check back here in the future for further updates.</p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    )
  );
};

export default Home;
