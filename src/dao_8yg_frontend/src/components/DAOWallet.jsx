import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Button, Dropdown, ButtonGroup } from 'react-bootstrap';
import { useCanister } from "@connect2ic/react";

const DAOWallet = () => {
  
  const [backend] = useCanister("backend");

  const [isLoading, setIsLoading] = useState(true);
  const [collections, setCollections] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [page, setPage] = useState(1);
  const count = 9;

  const fetchCollections = async () => {
    console.log(await backend.getAccountId());
    var collections = await backend.getCollections();
    setCollections(collections);
    setSelectedCollection(collections[0]);
  };

  const fetchNFTs = async () => {
    var nftWallet = await backend.getCollectionNFTs(Number(selectedCollection.id), Number(page), Number(count));
    setViewData(nftWallet);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      await fetchCollections();
    };
    fetchData();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if(selectedCollection == null){
      return;
    }

    const fetchData = async () => {
      await fetchNFTs();
      setIsLoading(false);
    };
    fetchData();
  }, [selectedCollection, page]);
  
  const handlePageChange = (change) => {
    setPage((prevPage) => prevPage + change);
  };

  return (
    isLoading ? (
      <div className="customOverlay d-flex flex-column align-items-center justify-content-center">
      <Spinner animation="border" />
      <p className='text-center mt-1'>Loading DAO Wallet</p>
    </div>) : 
    (
      <Container className="flex-grow-1 my-5">
        <Row>
          <Col md={12}>  
            <Dropdown className="mt-3">
              <Dropdown.Toggle id="collection-dropdown">
                {selectedCollection.name}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {collections.map((collection) => (
                  <Dropdown.Item key={collection.id} onClick={() => {setSelectedCollection(collection); setPage(1);} }>
                    {collection.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md={12}>
            <Row>
              {viewData.nfts.map((nft) => (
                <Col md={4} key={nft.tokenIndex}>
                  <Card className="mb-4">
                  <img
                    src={`https://${nft.canisterId}.raw.ic0.app/?type=thumbnail&tokenid=${nft.tokenId}`}
                    alt="NFT"
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
            <div className="d-flex justify-content-center mt-3 mb-3">
                <ButtonGroup>
                  <Button onClick={() => handlePageChange(-1)} disabled={page === 1}>
                    Prior
                  </Button>
                  <div className="d-flex align-items-center mr-3 ml-3">
                    <p className="mb-0">Page {page}/{Math.ceil(Number(viewData.totalEntries) / count)}</p>
                  </div>
                  <Button onClick={() => handlePageChange(1)} disabled={(page) * count >= Number(viewData.totalEntries)}>
                    Next
                  </Button>
                </ButtonGroup>
              </div>
          </Col>
        </Row>
      </Container>
    )
  );
};

export default DAOWallet;
