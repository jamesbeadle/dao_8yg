import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import GangImage from '../../assets/8yg_3.png';


const DAOWallet = () => {
  
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
            <Card className="mb-4">
              <Card.Header><h2 className="mt-2 mb-2 card-header">8 Years Gang Wallet</h2></Card.Header>
              <Card.Body>
                <img src={GangImage} alt="8yg" className='mt-2 mb-4' style={{ maxWidth: '100%', maxHeight: '100%', marginRight: '10px' }} />
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Row>
              <Col md={12}>
                <h1>The DAO Wallet</h1>
                <p className='mt-4 mb-4'>A list of the DAO's NFTs will appear here soon.</p>
                </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    )
  );
};

export default DAOWallet;
