import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import LogoImage from '../../assets/logo.png';


const Admin = () => {
  
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
                <h1>8YG Admin</h1>
                <p className='mt-4 mb-4'>Admin page to allow admin user to list, delist, update purchase and sale status of NFTs.</p>
                </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    )
  );
};

export default Admin;
