import React, { createContext, useState, useContext, useMemo } from "react";
import PropTypes from "prop-types"; // This will be used as you build out components

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // For now, let's simulate a logged-in user for testing protected routes.
  // In a real app, you'd load this from a token/localStorage.
  const [user, setUser] = useState({ name: "Test User", role: "user" });
  const [loading, setLoading] = useState(false); // Set to false for now

  const login = (userData) => {
    setUser(userData);
    // a good place to set token in localStorage
  };

  const logout = () => {
    setUser(null);
    // a good place to remove token from localStorage
  };

  // useMemo helps to prevent unnecessary re-renders of consuming components
  const value = useMemo(
    () => ({
      user,
      isLoggedIn: !!user,
      isAdmin: user?.role === "admin",
      login,
      logout,
      loading,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook for easy access to the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
