import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Button, Image, Alert } from 'react-bootstrap';
import ProfileImage from '../../../assets/profile_placeholder.png';
import { EditIcon, StarIcon, CopyIcon } from '../../icons';
import UpdateUsernameModal from './update-username-modal';
import UpdateProfilePictureModal from './update-profile-picture-modal';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const { isConnected } = useConnect();
  const [backend] = useCanister("backend");
  const [showUpdateUsernameModal, setShowUpdateUsernameModal] = useState(false);
  const [showUpdateProfilePictureModal, setShowUpdateProfilePictureModal] = useState(false);
  const [profilePicSrc, setProfilePicSrc] = useState(ProfileImage);

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
      await fetchViewData();
      setIsLoading(false);
    };

    fetchData();

  }, [isConnected, backend]);

  const hideUpdateUsernameModal = async (changed) => {
    if(!changed){
      setShowUpdateUsernameModal(false); 
      return;
    }
    setIsLoading(true);
    setShowUpdateUsernameModal(false); 
    await fetchViewData();
    setIsLoading(false);
  };

  const hideUpdateProfilePictureModal = async (changed) => {
    if(!changed){
      setShowUpdateProfilePictureModal(false); 
      return;
    }
    setIsLoading(true);
    setShowUpdateProfilePictureModal(false); 
    await fetchViewData();
    setIsLoading(false);
  };

  const fetchViewData = async () => {
    const userProfile = await backend.getProfilePageDTO();
    setProfile(userProfile);

    if (userProfile.profilePicture && userProfile.profilePicture.length > 0) {
     
      const blob = new Blob([userProfile.profilePicture]);
      const blobUrl = URL.createObjectURL(blob);
      setProfilePicSrc(blobUrl);

    } else {
      setProfilePicSrc(ProfileImage);
    }
    
  };

  const toHexString = (byteArray) => {
    return Array.from(byteArray, function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('').toUpperCase();
  };

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
          <Col md={12} >
            <h4>Profile</h4>

            <div className="text-center">
              <div className="position-relative d-inline-block">
                <Image src={profilePicSrc} roundedCircle width="100" />
                <div className="position-absolute" style={{ top: "-10px", right: "-10px" }}>
                  <EditIcon onClick={() => setShowUpdateProfilePictureModal(true)} />
                </div>
              </div>
            </div>

            <h4 className='text-center'>{profile.username}  <EditIcon onClick={() => setShowUpdateUsernameModal(true)}></EditIcon></h4>
            <div className='text-center'>
              {Array(profile.highestNFTRarity).fill().map((_, i) => <StarIcon key={i} color="#807A00" margin="5px" />)}
            </div>
            
            <Row className="mt-2 justify-content-center">
              <Col className="text-center">
                <h2 className='numerical-text'>{profile.totalVotingPower}</h2>
                <p><small>Voting Power</small></p>
              </Col>
              <Col className="text-center">
                <h2 className='numerical-text'>{Number(profile.airdropShare).toFixed(3)}%</h2>
                <p><small>Airdrop Share</small></p>
              </Col>
            </Row>
            
            {profile.airdropShare === 0 && 
              <Alert variant="warning">You need 20 VP to qualify for future Airdrops.</Alert>}
            
            <Row className="mt-2 justify-content-center">
              <Col md={12} sm={12} className="text-center">
                <p>Earned $8YG: <span className='numerical-text' style={{fontSize: 22}}>{profile.earnings.toLocaleString()}</span></p>
                <p>ICP Balance: <span className='numerical-text' style={{fontSize: 22}}>{profile.balance.toLocaleString()}</span></p>
              </Col>
            </Row>

            <Row className="mt-2 justify-content-center">
                <Button variant="primary" disabled>Withdraw</Button>
            </Row>

            <Row className="mt-4 justify-content-center">
              <Col md={12} sm={12} className="text-center">
                <p style={{ wordBreak: 'break-all' }}>
                  <small>Deposit Address: {toHexString(profile.depositAddress)} </small>
                  <CopyIcon></CopyIcon>
                </p>
                <p><small>Principal: {profile.principal} </small><CopyIcon></CopyIcon></p>
              </Col>
            </Row>

          </Col>
        </Row>

        <UpdateUsernameModal
          show={showUpdateUsernameModal}
          onHide={hideUpdateUsernameModal}
          displayName={profile.username}
        />

        <UpdateProfilePictureModal
          show={showUpdateProfilePictureModal}
          onHide={hideUpdateProfilePictureModal}
        />



      </Container>
    )
  );

};

export default Profile;
