import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Card, CardDeck } from 'react-bootstrap';
import LogoImage from '../../assets/logo.png';
import { useConnect, useCanister } from "@connect2ic/react";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userPrincipal, setUserPrincipal] = useState('');
  const [nfts, setNfts] = useState([]);
  const [totalVotingPower, setTotalVotingPower] = useState(0);
  const { isConnected, principal } = useConnect();
  const [backend] = useCanister("backend");

  useEffect(() => {
    if (!isConnected || !backend) {
      return;
    }

    const fetchData = async () => {

      let symbolKey = Symbol.for('ic-agent-metadata');
      let keysCount = Object.keys(await backend[symbolKey].config.agent._identity).length > 0;
      
      if(keysCount == 0){
        return;
      }
      
      const fetchedNfts = await backend.getVotingNFTs();
      setNfts(fetchedNfts);
      const totalPower = fetchedNfts.reduce((acc, nft) => acc + nft.votingPower, 0);
      setTotalVotingPower(totalPower);
      setUserPrincipal(principal);
      setIsLoading(false);
    };
    fetchData();

  }, [isConnected, backend]);

  return (
      isLoading ? (
          <div className="customOverlay d-flex flex-column align-items-center justify-content-center">
              <Spinner animation="border" />
              <p className='text-center mt-1'>Loading</p>
          </div>
      ) :
      (
          <Container className="flex-grow-1 my-5">
              <Row>
                  <Col md={12}>
                      <h1>Your Profile</h1>
                      <p>User Principal: {userPrincipal}</p>
                      <br />
                      <h4>Voting Power</h4>
                      <p>Total: {totalVotingPower}</p>
                      <br />
                      <h6>NFTs:</h6>
                  </Col>
              </Row>
              <Row>
                  <CardDeck>
                      {nfts.map((nft) => (
                          <Card key={nft.id} style={{maxWidth: '18rem'}} className="mb-4">
                              <Card.Header>NFT ID: {nft.id}</Card.Header>
                              <Card.Img variant="top" src={`https://${nft.canisterId}.raw.ic0.app/?type=thumbnail&tokenid=${nft.tokenId}`} />
                              <Card.Body>
                                  <Card.Text>Voting Power: {nft.votingPower}</Card.Text>
                              </Card.Body>
                          </Card>
                      ))}
                  </CardDeck>
              </Row>
          </Container>
      )
  );

};

export default Profile;
