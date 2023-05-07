import * as React from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import '../assets/custom.scss';
import Home from "./components/Home";
import Logo from '../assets/logo.png';
import { AuthProvider } from "./contexts/AuthContext";
import MyNavbar from './components/shared/navbar';
import MyFooter from './components/shared/footer';
import DAOWallet from "./components/DAOWallet";
import BannerTop from "./components/shared/banner";
import Admin from "./components/Admin";
import Proposals from "./components/Proposals";
import Tokenomics from "./components/Tokenomics";
import Profile from "./components/Profile";

const PrivateWindowFallback = () => {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <h3 className="text-center">You cannot play from a private browser window.</h3>
      <img src={Logo} alt="8yg" style={{ maxWidth: '200px', maxHeight: '100%', marginTop: '50px' }} />
      
    </div>
  );
};

const App = () => {

  const [isPrivateWindow, setIsPrivateWindow] = React.useState(false);

  React.useEffect(() => {
    if (window.indexedDB) {
      const request = window.indexedDB.open("TestDB");

      request.onerror = () => {
        setIsPrivateWindow(true);
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        db.close();
        const deleteRequest = window.indexedDB.deleteDatabase("TestDB");
  
        deleteRequest.onerror = (event) => {
          console.error("Failed to delete TestDB", event);
        };
  
        deleteRequest.onsuccess = () => {
          //console.log("TestDB deleted successfully");
        };
      };
    } else {
      setIsPrivateWindow(true);
    }
  }, []);

  if (isPrivateWindow) {
    return (
      <PrivateWindowFallback />
    );
  }

  return (
    <AuthProvider>
      <Router>
        
        <BannerTop />
      
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <MyNavbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Admin" element={<Admin />} />
            <Route path="/Proposals" element={<Proposals />} />
            <Route path="/DAOWallet" element={<DAOWallet />} />
            <Route path="/Tokenomics" element={<Tokenomics />} />
            <Route path="/Profile" element={<Profile />} />
            </Routes>
          <MyFooter />
        </div>
      </Router>   
    </AuthProvider>
  );
};

const root = document.getElementById("app");
createRoot(root).render(
    <App />
);
