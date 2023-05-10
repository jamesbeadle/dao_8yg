import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import WalletImage from '../../assets/dao_wallet.jpg';
import { StoicIdentity } from "ic-stoic-identity";
import { dao_8yg_backend as backend } from '../../../declarations/dao_8yg_backend';
import CustomSVG from './CustomSVG';


const DAOWallet = () => {
  
  const [isLoading, setIsLoading] = useState(true);
  const [nfts, setNfts] = useState([]);
  
  useEffect(() => {

    //checkIdentity();

    const fetchData = async () => {
      var nftWallet = await backend.getNFTWallet();

      /*var nftWallet = [
        {
            "tokenId": "hls6x-4ikor-uwiaa-aaaaa-buaf4-uaqca-aaant-a",
            "tokenIndex": 870,
            "canisterId": "tskpj-aiaaa-aaaag-qaxsq-cai",
            "accountIdentifier": "0fa2901a7d5b36b1412ae14fc8c71ae424a7977930f59d230a0eb494f5e1b3c6"
        },
        {
            "tokenId": "djtqm-hakor-uwiaa-aaaaa-deaha-qaqca-aaaae-q",
            "tokenIndex": 9,
            "canisterId": "buja2-4iaaa-aaaam-qa4ca-cai",
            "accountIdentifier": "0fa2901a7d5b36b1412ae14fc8c71ae424a7977930f59d230a0eb494f5e1b3c6"
        }
    ];
    */


      setNfts(nftWallet);
      console.log(nftWallet);
      
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const checkIdentity = async () => {
    StoicIdentity.load().then(async identity => {
      if (identity !== false) {
        //ID is a already connected wallet!
      } else {
        //No existing connection, lets make one!
        identity = await StoicIdentity.connect();
      }
      
      //Lets display the connected principal!
      console.log(identity.getPrincipal().toText());
      
      //Create an actor canister
      const actor = Actor.createActor(idlFactory, {
        agent: new HttpAgent({
          identity,
        }),
        canisterId,
      });
      
      //Disconnect after
      StoicIdentity.disconnect();
    })
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
          <Col md={12}>
            <Row>
              {nfts.map((nft) => (
                <Col md={4} key={nft.tokenIndex}>
                  <Card className="mb-4">
                    
                  <CustomSVG
                      canisterId={nft.canisterId}
                      tokenId={nft.tokenId}
                      className="custom-svg"
                      style={{ width: "100%" }}
                    />
                  <Card.Body>
                    <Card.Title>NFT #{nft.tokenIndex + 1}</Card.Title>
                  </Card.Body>
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

export default DAOWallet;

/*
<Card.Img variant="top" src={`https://${nft.canisterId}.raw.ic0.app/?type=thumbnail&?tokenid=${nft.tokenId}`} />
                

                <p className='mt-4 mb-4'>Filter by collection.</p>
                <p className='mt-4 mb-4'>Filter by for sale or not.</p>

                */
