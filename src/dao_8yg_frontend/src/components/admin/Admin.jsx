import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import LogoImage from '../../../assets/logo.png';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Collections from './Collections';

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
        <Tabs defaultActiveKey="collections" id="uncontrolled-tab-example" className="mb-3">
          <Tab eventKey="collections" title="Collections">
            <Collections />
          </Tab>
          <Tab eventKey="listed" title="NFT Listings" disabled>
          </Tab>
        </Tabs>
      </Container>
    )
  );
};

export default Admin;
