import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
      await login(credentials); // Use login from AuthContext, it already sets the user
      navigate("/dashboard"); // Redirect on success
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || "Failed to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link to="/register" className="font-medium text-primary hover:text-primary-dark">
            start your 14-day free trial
          </Link>
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm onSubmit={handleLogin} loading={loading} errorMessage={errorMessage} />
        </div>
      </div>
    </div>
  );
};

export default Login;
