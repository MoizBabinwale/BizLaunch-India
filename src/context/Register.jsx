import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import RegisterForm from "../../components/forms/RegisterForm.jsx"; // Corrected path

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (userData) => {
    setLoading(true);
    setErrorMessage("");
    try {
      await register(userData); // Use register from AuthContext
      navigate("/dashboard"); // Redirect on success
    } catch (error) {
      setErrorMessage(error.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return <RegisterForm onSubmit={handleRegister} loading={loading} errorMessage={errorMessage} />;
};
export default Register;
