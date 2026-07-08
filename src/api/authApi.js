import { api } from "./index";

export const loginUser = (credentials) =>
  api("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const registerUser = (data) =>
  api("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const logoutUser = () =>
  api("/auth/logout", {
    method: "POST",
  });

export const forgotPassword = (email) =>
  api("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export const resetPassword = (token, password) =>
  api(`/auth/reset-password/${token}`, {
    method: "POST",
    body: JSON.stringify({ password }),
  });

// ==============================
// VERIFY EMAIL
// ==============================

export const verifyEmail = async (token) => {
  const { data } = await api.post("/auth/verify-email", {
    token,
  });

  return data;
};