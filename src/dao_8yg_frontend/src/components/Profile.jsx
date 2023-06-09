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
                    <p className='mt-2'>{userPrincipal}</p>
                    <br />
                    <h4>Total Voting Power</h4>
                    <h1 className='numerical-text'>{totalVotingPower}</h1>
                    <br />
                    <h6>NFTs:</h6>
                </Col>
            </Row>
            <Row className="mt-3">
            <Col md={12}>
                <Row>
                    {nfts.map((nft) => (
                         <Col md={4} key={nft.id}>
                            <Card className="mb-4">
                                <img
                                    src={`https://${nft.canisterId}.raw.ic0.app/?type=thumbnail&tokenid=${nft.tokenId}`}
                                    alt="NFT"
                                    className="custom-svg"
                                    style={{ width: "100%" }}
                                />
                                <Card.Body>
                                    <Card.Title>NFT #{nft.id}</Card.Title>
                                </Card.Body>
                                <Card.Footer>
                                  <Card.Text>Voting Power: {nft.votingPower}</Card.Text>
                                </Card.Footer>
                            </Card>
                        </Col>
                      ))}
                </Row>
            </Col>
        </Row>
    </Container>
    )
  );

};

export default Profile;
