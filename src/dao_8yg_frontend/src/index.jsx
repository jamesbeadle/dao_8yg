import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import '../assets/custom.scss';
import Home from "./components/Home";
import Logo from '../assets/logo.png';
import MyNavbar from './components/shared/navbar';
import MyFooter from './components/shared/footer';
import DAOWallet from "./components/DAOWallet";
import BannerTop from "./components/shared/banner";
import Admin from "./components/admin/Admin";
import Proposals from "./components/Proposals";
import Tokenomics from "./components/Tokenomics";
import Profile from "./components/Profile";

import { StoicWallet } from "@connect2ic/core/providers/stoic-wallet";
import { InfinityWallet } from "@connect2ic/core/providers/infinity-wallet";
import { PlugWallet } from "@connect2ic/core/providers/plug-wallet";

import { createClient } from "@connect2ic/core"
import { defaultProviders } from "@connect2ic/core/providers"
import { ConnectDialog, Connect2ICProvider } from "@connect2ic/react"

import style from "@connect2ic/core/style.css"
console.log(style)

import * as backend from '../../declarations/dao_8yg_backend';


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
      <Router>
        <ConnectDialog />
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
  );
};

const client = createClient({
  canisters: {
    backend
  },
  providers: [
    new StoicWallet(),
    new InfinityWallet(),
    new PlugWallet(),
  ]
})

const root = document.getElementById("app");
createRoot(root).render(
  <Connect2ICProvider client={client}>
    <App />
  </Connect2ICProvider>
);
