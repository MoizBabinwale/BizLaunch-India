import {
  loginUser,
  registerUser,
  logoutUser,
  loginWithGoogle,
  resetPasswordApi
} from "../api/authApi";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export const authService = {
  // ===============================
  // LOGIN
  // ===============================
  async login(credentials) {
    const response = await loginUser(credentials);

    if (response.token) {
      sessionStorage.setItem(TOKEN_KEY, response.token);
    }

    if (response.user) {
      sessionStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }

    return response;
  },

  // ===============================
  // REGISTER
  // ===============================
  async register(data) {
    const response = await registerUser(data);

    if (response.token) {
      sessionStorage.setItem(TOKEN_KEY, response.token);
    }

    if (response.user) {
      sessionStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }

    return response;
  },

  

  // ===============================
  //  // GOOGLE LOGIN // 
  // ===============================
 async loginWithGoogle(idToken) {
  const response = await loginWithGoogle(idToken);

  if (response.token) {
    sessionStorage.setItem(TOKEN_KEY, response.token);
  }

  if (response.user) {
    sessionStorage.setItem(
      USER_KEY,
      JSON.stringify(response.user)
    );
  }

  return response;
},

async resetPassword(token, password) {
  return await resetPasswordApi(token, password);
},

  // ===============================
  // LOGOUT
  // ===============================
  async logout() {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
    }
  },

  // ===============================
  // AUTH STATUS
  // ===============================
  isAuthenticated() {
    return !!sessionStorage.getItem(TOKEN_KEY);
  },

  // ===============================
  // CURRENT USER
  // ===============================
  getCurrentUser() {
    const user = sessionStorage.getItem(USER_KEY);

    return user ? JSON.parse(user) : null;
  },

  // ===============================
  // TOKEN
  // ===============================
  getToken() {
    return sessionStorage.getItem(TOKEN_KEY);
  },

  setToken(token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  },

  removeToken() {
    sessionStorage.removeItem(TOKEN_KEY);
  },

  // ===============================
  // USER
  // ===============================
  setUser(user) {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser() {
    sessionStorage.removeItem(USER_KEY);
  },

  clear() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  },
};