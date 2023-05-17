import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Card, Button, Table, Dropdown } from 'react-bootstrap';
import CreateCollectionModal from './create-collection-modal';
import EditCollectionModal from './edit-collection-modal';
import DeleteCollectionModal from './delete-collection-modal';
import { useNavigate } from "react-router-dom";
import { useCanister } from "@connect2ic/react";

const Collections = () => {
  const navigate = useNavigate();
  const [backend] = useCanister("backend");
  
  const [isLoading, setIsLoading] = useState(true);
  const [collectionsData, setCollectionsData] = useState([]);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  const [editedCollection, setEditedCollection] = useState(null);
  const [collectionToDelete, setCollectionToDelete] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {


      setIsLoading(false);
    };
    fetchData();
  }, []);

  const refreshLocalCopy = async (collection) => {
    setIsLoading(true);
    await backend.refreshLocalNFTs(collection.canisterId);
    setIsLoading(false);
  };

  const editCollection = async (collection) => {
    setEditedCollection(collection);
    setShowEditModal(true);
  };

  const deleteCollection = async (collectionId) => {
    setCollectionToDelete(collectionId);
    setShowDeleteConfirmModal(true);
  };  

  const hideCreateModal = async () => {
    setShowCreateModal(false); 
    fetchCollections();
    setIsLoading(false);
  };

  const hideEditModal = async () => {
    setShowEditModal(false); 
    setEditedCollection(null);
    fetchCollections();
    setIsLoading(false);
  };

  const hideDeleteModal = async () => {
    setShowDeleteConfirmModal(false); 
    setCollectionToDelete(null);
    fetchCollections();
    setIsLoading(false);
  };

  const fetchCollections = async () => {
    const colllections = await backend.getCollections();
    setCollectionsData(colllections);
    setIsLoading(false);
  };

  useEffect(() => {
    if(!isAdmin){
      navigate("/");
    }
    fetchCollections();
  }, []);

  return (
    <Container>
    {isLoading && (
      <div className="customOverlay d-flex flex-column align-items-center justify-content-center">
      <Spinner animation="border" />
      <p className='text-center mt-1'>Loading Collections</p>
    </div>
    )} 
      <Row className="justify-content-md-center">
          <Col md={12}>
              <Card className="mt-4 custom-card mb-4">
                  <Card.Header className="text-center">
                    <h2>Approved Collections</h2>
                  </Card.Header>
                  <Card.Body>
                  <Button className="mb-3" onClick={() => setShowCreateModal(true)}>
                      Add New Collection
                  </Button>
                  <div className="table-responsive">
                      <Table className="custom-table" bordered>
                          <thead>
                              <tr>
                                  <th>Id</th>
                                  <th>Name</th>
                                  <th>Canister</th>
                                  <th>Options</th>
                              </tr>
                          </thead>
                          <tbody>
                              {collectionsData.map((collection) => (
                              <tr key={collection.id}>
                                  <td>{collection.id}</td>
                                  <td>{collection.name}</td>
                                  <td>{collection.canisterId}</td>
                                  <td>
                                  <Dropdown alignRight className="custom-dropdown">
                                      <Dropdown.Toggle variant="secondary" id="dropdown-basic">Options</Dropdown.Toggle>
                                      <Dropdown.Menu>
                                      <Dropdown.Item href="#" onClick={() => refreshLocalCopy(collection)}>Refresh Local Copy</Dropdown.Item>
                                      <Dropdown.Item href="#" onClick={() => editCollection(collection)}>Edit</Dropdown.Item>
                                      <Dropdown.Item href="#" onClick={() => deleteCollection(collection.id)}>Delete</Dropdown.Item>
                                      </Dropdown.Menu>
                                  </Dropdown>
                                  </td>
                              </tr>
                              ))}
                          </tbody>
                      </Table>
                  </div>
                  </Card.Body>
              </Card>
          </Col>
      </Row>

      <CreateCollectionModal
          show={showCreateModal}
          onHide={hideCreateModal}
          setIsLoading={setIsLoading}
      />

      <EditCollectionModal
          show={showEditModal}
          onHide={hideEditModal}
          setIsLoading={setIsLoading}
          editedCollection={editedCollection}
      />        
      
      <DeleteCollectionModal
          show={showDeleteConfirmModal}
          onHide={hideDeleteModal}
          setIsLoading={setIsLoading}
          collectionToDelete={collectionToDelete}
      />
    </Container>
  );
};

export default Collections;
