import { api } from "./index";

export const loginUser = (credentials) =>
  api("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

// export const loginWithGoogle = (idToken) =>
//   api("/auth/google", {
//     method: "POST",
//     body: JSON.stringify({ idToken }),
//   });

export const requestMobileOtp = (phone) =>
  api("/auth/otp/request", {
    method: "POST",
    body: JSON.stringify({ phone }),
  });

export const verifyMobileOtp = (phone, code) =>
  api("/auth/otp/verify", {
    method: "POST",
    body: JSON.stringify({ phone, code }),
  });
  export const loginWithGoogle = (idToken) => {
  return api("/auth/google", {
    method: "POST",
    body: JSON.stringify({ idToken }),
  });
};

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
    body: JSON.stringify(email ),
  });

export const resetPasswordApi = (token, password) =>
  api(`/auth/reset-password/${token}`, {
    method: "POST",
    body: JSON.stringify({ password }),
  });

// ==============================
// VERIFY EMAIL
// ==============================

export const verifyEmail = async (token) => {
  return api("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
};