import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { LoginForm } from "./components/forms/LoginForm.jsx";
import RegisterForm from "./components/forms/RegisterForm";
import { apiRequest } from "../../services/api"; // Assuming this is still valid

const AuthPage = ({ mode }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (formData) => {
    setLoading(true);
    setMessage("");
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      // NOTE: This logic should be moved to AuthContext
      sessionStorage.setItem("token", data.accessToken);
      sessionStorage.setItem("user", JSON.stringify(data.user));
      // In a real app, you'd call a context function here, e.g., auth.login(data)
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || "Failed to login.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (formData) => {
    // Similar logic for registration
    console.log("Registering with:", formData);
    navigate("/login"); // Redirect to login after registration for now
  };

  const isLogin = mode === "login";

  return (
    <>
      <Helmet>
        <title>{isLogin ? "Login" : "Register"} - BizLaunch India</title>
        <meta name="description" content="Create your business account, verify your email, and start your launch dashboard." />
      </Helmet>
      <main className="auth-layout">
        <section className="auth-card">
          <div className="section-heading compact">
            <span className="eyebrow">Account access</span>
            <h1>{isLogin ? "Welcome back" : "Create your launch account"}</h1>
            <p>Use the dashboard to create your business profile, product catalogue, and public page.</p>
          </div>

          <div className="tab-switch">
            <Link to="/login" className={isLogin ? "active" : ""}>
              Login
            </Link>
            <Link to="/register" className={!isLogin ? "active" : ""}>
              Register
            </Link>
          </div>

          {isLogin ? <LoginForm onSubmit={handleLogin} loading={loading} errorMessage={message} /> : <RegisterForm onSubmit={handleRegister} loading={loading} errorMessage={message} />}
        </section>
      </main>
    </>
  );
};

export default AuthPage;
