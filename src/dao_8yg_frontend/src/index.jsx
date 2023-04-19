import * as React from "react";
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import NFTList from "./components/NFTList";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {

  return (
    <Router>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <Routes>
            <Route path="/" element={<NFTList />} />
          </Routes>
        </div>
      </Router>   
  );
};

const root = document.getElementById("app");
createRoot(root).render(
    <App />
);
