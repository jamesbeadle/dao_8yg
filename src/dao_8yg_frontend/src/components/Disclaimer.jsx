import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Form, Button} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const Disclaimer = () => {
  
  const [isLoading, setIsLoading] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(false);
    };
    fetchData();
    window.scrollTo(0, 0);
  }, []);

  const handleAcceptChange = async (e) => {
    setAccepted(e.target.checked);
  }

  const acceptDisclaimer = async (e) => {
    navigate('/');
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
              <Col md={12}>
                <h1>Disclaimer</h1>
                <p className='mt-4 mb-4'>The following disclaimer governs your use of the 8 Years Gang DAO website and all associated services. By accessing and using our website, you agree to be bound by the terms and conditions outlined in this disclaimer. Please read this disclaimer carefully before proceeding.</p>
                
                <p className='mt-4 mb-4'><b>1. No Financial or Legal Advice:</b><br />
                The information provided on the 8 Years Gang DAO website is for informational purposes only and should not be considered as financial or legal advice. We do not provide investment, financial, or legal advice, and any decisions made based on the information provided on our website are at your own risk. We recommend consulting with a qualified professional before making any financial or legal decisions.</p>
                
                <p className='mt-4 mb-4'><b>2. Risks and Volatility:</b><br />
                Engaging in cryptocurrency and blockchain-related activities, including participating in the 8 Years Gang DAO, involves inherent risks. The value of cryptocurrencies can fluctuate significantly, and there is a risk of financial loss. We do not guarantee the performance, value, or success of any investments or activities related to the 8 Years Gang DAO.</p>
                
                <p className='mt-4 mb-4'><b>3. Third-Party Websites and Services:</b><br />
                Our website may contain links to third-party websites or services that are not under our control. We are not responsible for the content, accuracy, or reliability of any third-party websites or services. The inclusion of these links does not imply endorsement or recommendation.</p>
                
                <p className='mt-4 mb-4'><b>4. No Warranty:</b><br />
                The 8 Years Gang DAO website and all associated services are provided on an "as is" and "as available" basis without any warranties or representations, express or implied. We make no guarantees regarding the accuracy, completeness, timeliness, or reliability of any information provided on our website. You use our website and services at your own risk.</p>
                
                <p className='mt-4 mb-4'><b>5. Intellectual Property:</b><br />
                All intellectual property rights, including copyrights, trademarks, and logos, related to the 8 Years Gang DAO website and its content, belong to their respective owners. You may not reproduce, distribute, modify, or create derivative works without obtaining explicit permission.</p>
                                
                <p className='mt-4 mb-4'><b>6. Limitation of Liability:</b><br />
                To the extent permitted by law, we shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of the 8 Years Gang DAO website or any associated services. This includes but is not limited to financial loss, data loss, or any other damages.</p>
                                
                <p className='mt-4 mb-4'><b>7. Changes to the Disclaimer:</b><br />
                We reserve the right to modify or update this disclaimer at any time without prior notice. It is your responsibility to review the disclaimer periodically for any changes. Your continued use of the 8 Years Gang DAO website after any modifications signifies your acceptance of the updated disclaimer.</p>
                                
                <p className='mt-4 mb-4'>By accessing and using the 8 Years Gang DAO website, you acknowledge and agree to the terms and conditions outlined in this disclaimer. If you do not agree with any part of this disclaimer, you must refrain from using our website and services.</p>
              
                <Form.Group controlId="accept-disclaimer">
                  <Form.Check 
                    type="checkbox"
                    label="I confirm the terms and conditions."
                    checked={accepted}
                    onChange={handleAcceptChange}
                  />
                </Form.Group>

                
                <Button onClick={() => acceptDisclaimer()} disabled={!accepted}>
                    Save
                  </Button>
              
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    )
  );
};

export default Disclaimer;
