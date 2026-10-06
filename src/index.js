import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

import { AuthProvider } from "./context/AuthContext";
import { AlertProvider } from "./context/AlertContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
<GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <AlertProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </AlertProvider>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </HelmetProvider>
    
  </React.StrictMode>,
);

reportWebVitals();
