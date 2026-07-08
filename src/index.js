import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

import { AuthProvider } from "./context/AuthContext";
import { AlertProvider } from "./context/AlertContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AlertProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </AlertProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);

reportWebVitals();
