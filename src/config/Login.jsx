import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import LoginForm from "../components/forms/LoginForm.jsx"; // Corrected path
import AuthLayout from "../../layouts/AuthLayout.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (credentials) => {
    setErrorMessage("");
    try {
      await login(credentials);
      navigate("/dashboard"); // Redirect on success
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || "Failed to login.");
    }
  };

  return (
    <AuthLayout title="Sign in to your account" subtitle="And continue launching your business!">
      <LoginForm onSubmit={handleLogin} errorMessage={errorMessage} />
    </AuthLayout>
  );
};

export default Login;
