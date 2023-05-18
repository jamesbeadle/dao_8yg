import React, { useState, useEffect  } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link, useNavigate } from "react-router-dom";
import { ConnectButton, useConnect, useCanister } from "@connect2ic/react";

const MyNavbar = () => {

  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const { isConnected } = useConnect();
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

      let admin = await backend.isAdmin();
      setIsAdmin(admin);
    };
    fetchData();

  }, [isConnected, backend]);

  return (
    <Navbar expand="lg">
      <Navbar.Brand href="/">
        </Navbar.Brand>  
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse  id="responsive-navbar-nav" className="justify-content-end">
        
          {isConnected && isAdmin && 
            <Nav.Link as={Link} to="/Admin" onClick={() => setExpanded(false)} className="nav-link">
              Admin
            </Nav.Link>
          }
          
          {isConnected && (
            <>
              <Nav.Link as={Link} to="/Profile" onClick={() => setExpanded(false)} className="nav-link">
                Profile
              </Nav.Link>
            </>
          )}

          <ConnectButton />
        </Navbar.Collapse>
    </Navbar>
  );
};

export default MyNavbar;
