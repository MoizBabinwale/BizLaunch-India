const TOKEN_KEY = "token";
const USER_KEY = "user";

export const storage = {
  // ===========================
  // Token
  // ===========================

  getToken() {
    return sessionStorage.getItem(TOKEN_KEY);
  },

  setToken(token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  },

  removeToken() {
    sessionStorage.removeItem(TOKEN_KEY);
  },

  // ===========================
  // User
  // ===========================

  getUser() {
    const user = sessionStorage.getItem(USER_KEY);

    return user ? JSON.parse(user) : null;
  },

  setUser(user) {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser() {
    sessionStorage.removeItem(USER_KEY);
  },

  // ===========================
  // Authentication
  // ===========================

  isLoggedIn() {
    return !!this.getToken();
  },

  // ===========================
  // Update User
  // ===========================

  updateUser(updatedFields) {
    const currentUser = this.getUser();

    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      ...updatedFields,
    };

    this.setUser(updatedUser);
  },

  // ===========================
  // Clear Storage
  // ===========================

  clear() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  },
};
