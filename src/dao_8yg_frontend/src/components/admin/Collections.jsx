import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Card, Button, Table } from 'react-bootstrap';
import CreateCollectionModal from './create-collection-modal';
import EditCollectionModal from './edit-collection-modal';
import DeleteCollectionModal from './delete-collection-modal';


const Collections = () => {
  
  const [isLoading, setIsLoading] = useState(true);
  const [canistersData, setCanistersData] = useState([]);
  
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

  const hideCreateModal = async () => {
    setShowCreateModal(false); 
    fetchCollections();
    setIsLoading(false);
  };

  const hideEditModal = async () => {
    setShowEditModal(false); 
    setEditedTeam(null);
    fetchCollections();
    setIsLoading(false);
  };

  const hideDeleteModal = async () => {
    setShowDeleteConfirmModal(false); 
    setTeamToDelete(null);
    fetchCollections();
    setIsLoading(false);
  };

  return (
    isLoading ? (
      <div className="customOverlay d-flex flex-column align-items-center justify-content-center">
      <Spinner animation="border" />
      <p className='text-center mt-1'>Loading</p>
    </div>) : 
    (
      <Container className="flex-grow-1 my-5">
        <Row className="justify-content-md-center">
            <Col md={12}>
                <Card className="mt-4 custom-card mb-4">
                    <Card.Header className="text-center">
                    <h2>Approved Collections</h2>
                    </Card.Header>
                    <Card.Body>
                    <Button className="mb-3 custom-button" onClick={() => setShowCreateModal(true)}>
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
                                {canistersData.map((collection) => (
                                <tr key={collection.id}>
                                    <td>{collection.id}</td>
                                    <td>{collection.name}</td>
                                    <td>{collection.canister}</td>
                                    <td>
                                    <Dropdown alignRight className="custom-dropdown">
                                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">Options</Dropdown.Toggle>
                                        <Dropdown.Menu>
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
    )
  );
};

export default Collections;
