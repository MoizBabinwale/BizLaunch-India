import { apiRequest } from "../utils/api.js";

export const loginUser = (credentials) => {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const registerUser = (userData) => {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const logoutUser = () => {
  return apiRequest("/auth/logout", {
    method: "POST",
  });
};
