import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/ui/Button.jsx";

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();

  const handleToggleView = () => {
    setIsLoginView(!isLoginView);
    setError(null);
    setFormData({ name: "", email: "", password: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let user;
      if (isLoginView) {
        user = await authService.login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        user = await authService.register(formData);
      }
      loginContext(user); // Update auth context
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || `An error occurred during ${isLoginView ? "login" : "registration"}.`);
    } finally {
      setLoading(false);
    }
  };

  const title = isLoginView ? "Sign in to your account" : "Create a new account";
  const buttonText = isLoginView ? "Sign In" : "Create Account";
  const toggleText = isLoginView ? "Don't have an account?" : "Already have an account?";
  const toggleLinkText = isLoginView ? "Sign Up" : "Sign In";

  return (
    <>
      <Helmet>
        <title>{isLoginView ? "Login" : "Register"} - BizLaunch India</title>
      </Helmet>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">{title}</h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-card py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {!isLoginView && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text-primary">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full appearance-none rounded-md border border-border px-3 py-2 placeholder-muted shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full appearance-none rounded-md border border-border px-3 py-2 placeholder-muted shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-primary">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isLoginView ? "current-password" : "new-password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full appearance-none rounded-md border border-border px-3 py-2 placeholder-muted shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-danger">{error}</p>}

              <div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Processing..." : buttonText}
                </Button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
              {toggleText}{" "}
              <button onClick={handleToggleView} className="font-medium text-primary hover:text-primary-dark">
                {toggleLinkText}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
