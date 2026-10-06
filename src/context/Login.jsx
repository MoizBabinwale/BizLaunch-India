import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import LoginForm from "../../components/forms/LoginForm.jsx"; // Corrected path

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (credentials) => {
    setLoading(true);
    setErrorMessage("");
    try {
      const userData = await login(credentials); // Use login from AuthContext
      login(userData); // Update auth context
      navigate("/dashboard"); // Redirect on success
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || "Failed to login.");
    } finally {
      setLoading(false);
    }
  };

  return <LoginForm onSubmit={handleLogin} loading={loading} errorMessage={errorMessage} />;
};

export default Login;
