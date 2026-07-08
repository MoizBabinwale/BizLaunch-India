// src/config/baseURL.js

const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api"
    : "https://api.bizlaunchindia.com/api";

export default API_BASE_URL;