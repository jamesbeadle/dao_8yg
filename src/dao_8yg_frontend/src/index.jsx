import * as React from "react";
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {

  return (
    <div>
      <h1>8YG DAO</h1>
    </div>
  );
};

const root = document.getElementById("app");
createRoot(root).render(
    <App />
);
