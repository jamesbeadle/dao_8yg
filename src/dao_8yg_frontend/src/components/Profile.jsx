import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import LogoImage from '../../assets/logo.png';

const Profile = () => {

  
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
            <img src={LogoImage} alt="8yg" className='mt-2 mb-4' style={{ maxWidth: '100%', maxHeight: '100%', marginRight: '10px' }} />
          </Col>
          <Col md={6}>
            <Row>
              <Col md={12}>
                <h1>Profile Page</h1>
                <p>User Principal: {identity.getPrincipal().toText()}</p>
               
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    )
  );
};

export default Profile;


/* 
                <p className='mt-4 mb-4'>Profile page to allow users to stake and unstake their NFTs. It will show the user the NFTs they have staked.</p>
                <p className='mt-4 mb-4'>It will show the user their proposal voting history.</p>
                <p className='mt-4 mb-4'>It will show the user their deposit address for ICP.</p>
                <p className='mt-4 mb-4'>It will show the user their $8YG Balance, allow them to withdraw it to an account.</p>
                
                */
