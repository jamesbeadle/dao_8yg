import React, { useState, useContext, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import Banner from '../../../assets/banner.png';
import LogoSmall from '../../../assets/logo.png';


const BannerTop = () => {
  const navigate = useNavigate();

  const loadHomepage = () => {
    console.log("here")
    navigate("/");
  };

  return (
    <div>
        <div className="banner-container">
          <img src={Banner} alt="8yg" />
        </div>
        
        <div className="logo-container" onClick={() => loadHomepage()}>
          <img src={LogoSmall} alt="8yg" style={{ maxWidth: '4rem', marginTop: '-1rem' }}  />    
        </div>
    </div>
  );
};

export default BannerTop;
