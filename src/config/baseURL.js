// src/config/baseURL.js

// API host. Set REACT_APP_API_URL in the hosting dashboard to point the built
// site at a deployed backend; the fallback keeps local development working.
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api"
    : "https://crop-shedule-server-auth.vercel.app/api");

export default API_BASE_URL;