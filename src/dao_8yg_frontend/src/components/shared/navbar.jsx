import React, { useState, useContext, useEffect  } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from "react-router-dom";


const MyNavbar = () => {
  const { isAdmin, isAuthenticated, login, logout, identity } = useContext(AuthContext);
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }

  }, [isAuthenticated]);

  return (
    <Navbar className="p-0" expand="lg">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse  id="responsive-navbar-nav" className="justify-content-end custom-navbar">
          <img className="w-100" src='banner.png' alt="banner" />
        
          {isAuthenticated && isAdmin && 
            <Nav.Link as={Link} to="/Admin" onClick={() => setExpanded(false)} className="nav-link">
              Admin
            </Nav.Link>
          }
          
          {isAuthenticated ? (
            <>
              <Nav.Link as={Link} to="/Profile" onClick={() => setExpanded(false)} className="nav-link">
                Profile
              </Nav.Link>
              <Button onClick={() => { logout(); setExpanded(false); }}>Disconnect</Button>
            </>
          ) : (
            <Button className="centered-button" disabled onClick={() => { login(); setExpanded(false); }}>Connect</Button>
          )}
        </Navbar.Collapse>
    </Navbar>
  );
};

export default MyNavbar;
