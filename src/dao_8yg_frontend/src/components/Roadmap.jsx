import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import LogoImage from '../../assets/logo.png';


const Roadmap = () => {
  
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
          <Col>
            <h1>8 Years Gang Roadmap</h1>
            <h3 className='mt-4'>Airdrop</h3>
            <p>
                We plan to airdrop $8YG to all 8 Years Gang NFT holders in Q3/Q4 2023. Tokenomics to be confirmed.
            </p>
            <h3 className='mt-4'>Q3 2023</h3>
            <p>
                After the successful launch of the 8 Years Gang project it's time for us to take you into the world the 8 Years Gang. Over the next few months we will 
                release a series of Nuance articles detailing the story of the unique characters withing the 8 Years Gang.
            </p>
            <h3 className='mt-4'>Q4 2023</h3>
            <p>
                We aim for the DAO to begin trading NFTs in Q4 2023. The DAO will operate by conensus, 8 Years Gang NFT holders will earn rewards for their participation
                in the DAO's marketplace activities. 
            </p>
            <h3 className='mt-4'>Q1 2024</h3>
            <p>
                In 2024 we will we begin work on turning the 8 Years Gang characters outlined in our story into a play to earn game utilising the $8YG token. 
            </p>
          </Col>
        </Row>
      </Container>
    )
  );
};

export default Roadmap;
