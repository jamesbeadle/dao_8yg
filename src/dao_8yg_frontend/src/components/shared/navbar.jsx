import React, { useState, useContext, useEffect  } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link, useNavigate } from "react-router-dom";


const MyNavbar = () => {
  const { isAdmin, isAuthenticated, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <Navbar expand="lg">
      <Container>
        <Navbar.Brand href="/">
        </Navbar.Brand>  
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse  id="responsive-navbar-nav" className="justify-content-end">
          <Nav.Link as={Link} to="/Admin" onClick={() => setExpanded(false)} className="nav-link">
            Admin
          </Nav.Link>
          <Nav.Link as={Link} to="/Proposals" onClick={() => setExpanded(false)} className="nav-link">
            Proposals
          </Nav.Link>
          <Nav.Link as={Link} to="/DAOWallet" onClick={() => setExpanded(false)} className="nav-link">
            DAO Wallet
          </Nav.Link>
          <Nav.Link as={Link} to="/Tokenomics" onClick={() => setExpanded(false)} className="nav-link">
            Tokenomics
          </Nav.Link>
          <Nav.Link as={Link} to="/Profile" onClick={() => setExpanded(false)} className="nav-link">
            Profile
          </Nav.Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
