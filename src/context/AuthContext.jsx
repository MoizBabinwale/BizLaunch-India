import { createContext, useContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { authService } from "../services/authService";

export const AuthContext = createContext(null);

const initialState = {
  user: null,
  token: null,
  isLoggedIn: false,
  loading: true,
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(initialState);

  // -----------------------------
  // Restore Session
  // -----------------------------
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const user = sessionStorage.getItem("user");

    if (token && user) {
      setAuth({
        user: JSON.parse(user),
        token,
        isLoggedIn: true,
        loading: false,
      });
    } else {
      setAuth((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  }, []);

  // -----------------------------
  // Login
  // -----------------------------
  const login = async (credentials) => {
    const response = await authService.login(credentials);
console.log("response ",response);

    sessionStorage.setItem("token", response.token);
    sessionStorage.setItem("user", JSON.stringify(response.user));

    setAuth({
      user: response.user,
      token: response.token,
      isLoggedIn: true,
      loading: false,
    });

    return response.user;
  };

  // -----------------------------
  // Register
  // -----------------------------
  const register = async (data) => {
    const response = await authService.register(data);

    if (response.token) {
      sessionStorage.setItem("token", response.token);
      sessionStorage.setItem("user", JSON.stringify(response.user));

      setAuth({
        user: response.user,
        token: response.token,
        isLoggedIn: true,
        loading: false,
      });
    }

    return response;
  };

  // -----------------------------
  // Logout
  // -----------------------------
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {}

    sessionStorage.clear();

    setAuth({
      user: null,
      token: null,
      isLoggedIn: false,
      loading: false,
    });
  };

  // -----------------------------
  // Context Value
  // -----------------------------
  const value = useMemo(
    () => ({
      auth,
      setAuth,
      login,
      register,
      logout,
    }),
    [auth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
