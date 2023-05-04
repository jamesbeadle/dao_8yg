import React from 'react';
import { Button } from 'react-bootstrap';
import { StoicIdentity } from "ic-stoic-identity";

const listNFT = async () =>{
  //list the nft on entrepot
};

const connectWallet = async () => {
  StoicIdentity.load().then(async identity => {
    if (identity !== false) {
      //ID is a already connected wallet!
    } else {
      //No existing connection, lets make one!
      identity = await StoicIdentity.connect();
    }
    
    //Lets display the connected principal!
    console.log(identity.getPrincipal().toText());
    
    StoicIdentity.disconnect();
  })
  
};

const Dashboard = () => {
  
  return (
    <div>
        <h1>NFT List</h1>
        <Button vriant="primary" onClick={() => connectWallet()} >Connect Stoic Wallet</Button>
        <br />
        <Button vriant="primary" onClick={() => listNFT()} >List NFT on Entrepot</Button>
                    
    </div>
      
  );
};

export default Dashboard;
