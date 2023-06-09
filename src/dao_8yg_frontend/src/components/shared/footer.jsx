import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import TwitterIcon from '../../../assets/twitter.png';
import DiscordIcon from '../../../assets/discord.png';
import OpenChatIcon from '../../../assets/openchat.png';
import ToniqIcon from '../../../assets/toniq.png';

const MyFooter = () => {
  return (
    <footer className="footer mt-auto py-3 custom-footer">
      <Container>
        <Row>
          <Col className="text-center">
            {/* Add the icons with their respective links */}
            <a href="https://twitter.com/8YearsGang" target="_blank" rel="noopener noreferrer">
              <img src={TwitterIcon} alt="Twitter" className="social-icon" />
            </a>
            <a href="https://discord.gg/JTvmbg2VJ7" target="_blank" rel="noopener noreferrer">
              <img src={DiscordIcon} alt="Discord" className="social-icon" />
            </a>
            <a href="https://oc.app/4xvtj-3aaaa-aaaaf-asq4a-cai/?ref=ohsck-sqaaa-aaaaf-asucq-cai" target="_blank" rel="noopener noreferrer">
              <img src={OpenChatIcon} alt="OpenChat" className="social-icon" />
            </a>
            <a href="https://toniq.io/marketplace/8-years-gang" target="_blank" rel="noopener noreferrer">
              <img src={ToniqIcon} alt="Toniq" className="social-icon" />
            </a>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col className="text-center">
            8 Years Gang
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default MyFooter;
