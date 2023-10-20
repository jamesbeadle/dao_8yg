import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Spinner, Card } from 'react-bootstrap';
import DAOImage from '../../assets/dao.png';
import TableImage from '../../assets/table.png';
import CheckNFTModal from './check-nft-modal';
import { useNavigate } from "react-router-dom";
import AuctionImage from '../../assets/8YGAuction.jpg';

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
      <Container className="flex-grow-1 vertical-flex" fluid>

        <Card className='vertical-flex w-100'>
          <h1 className='text-center'>Updates coming soon</h1>
        </Card>
        

      </Container>

      

    )
  );
};

export default Home;
