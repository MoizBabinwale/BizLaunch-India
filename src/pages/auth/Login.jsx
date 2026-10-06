import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { GoogleLogin } from "@react-oauth/google";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
// import { loginWithGoogle } from "../../api/authApi";

const Login = () => {
  const navigate = useNavigate();

  const { login ,loginWithGoogleAuth } = useAuth();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: true,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      setError("");

      await login(formData);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

const handleGoogleLogin = async (credentialResponse) => {
  try {
    setLoading(true);
    setError("");

    const credential = credentialResponse?.credential;

    if (!credential) {
      throw new Error("Google did not return a credential");
    }

    // AuthContext handles token, user and auth state
    await loginWithGoogleAuth(credential);

    // Now authentication state is updated
    navigate("/dashboard", {
      replace: true,
    });

  } catch (err) {
    console.error("Google login error:", err);

    setError(
      err?.message || "Google login failed. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <Helmet>
        <title>Login | BizLaunch India</title>

        <meta
          name="description"
          content="Login to BizLaunch India"
        />
      </Helmet>

      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-white to-primary-sky px-5 py-10">
        <div className="w-full max-w-md">
                    {/* Login Card */}

          <div
            className="
              overflow-hidden
              rounded-3xl
              border
              border-white/70
              bg-white/90
              shadow-2xl
              backdrop-blur-xl
            "
          >
            {/* Header */}

            <div className="border-b border-border bg-primary px-8 py-8 text-center text-white">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 text-4xl font-bold shadow-xl">
                B
              </div>

              <h1 className="font-display text-3xl font-bold">
                Welcome Back
              </h1>

              <p className="mt-2 text-primary-sky">
                Sign in to manage your business website
              </p>
            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-6 p-8"
            >
              {error && (
                <div
                  className="
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    text-red-600
                  "
                >
                  {error}
                </div>
              )}

              {/* Email */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-text-primary">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-muted
                    "
                  />

                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-border
                      bg-background
                      pl-12
                      pr-4
                      outline-none
                      transition-all
                      duration-300
                      focus:border-primary
                      focus:ring-4
                      focus:ring-primary/10
                    "
                  />
                </div>

                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-text-primary">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-muted
                    "
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    autoComplete="current-password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-border
                      bg-background
                      pl-12
                      pr-14
                      outline-none
                      transition-all
                      duration-300
                      focus:border-primary
                      focus:ring-4
                      focus:ring-primary/10
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-muted
                      hover:text-primary
                    "
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>
                            {/* Remember + Forgot Password */}

              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                    className="
                      h-4
                      w-4
                      rounded
                      border-border
                      text-primary
                      focus:ring-primary
                    "
                  />

                  <span className="text-sm text-text-secondary">
                    Remember Me
                  </span>
                </label>

                <Link
                  to="/forgot-password"
                  className="
                    text-sm
                    font-semibold
                    text-primary
                    transition
                    duration-300
                    hover:text-primary-dark
                  "
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}

              <button
                type="submit"
                disabled={loading}
                className="
                  flex
                  h-14
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-2xl
                  bg-primary
                  text-base
                  font-semibold
                  text-white
                  shadow-xl
                  shadow-primary/25
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-primary-dark
                  hover:shadow-2xl
                  disabled:cursor-not-allowed
                  disabled:opacity-70
                "
              >
                {loading ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="white"
                        strokeWidth="4"
                        opacity=".25"
                      />

                      <path
                        fill="white"
                        d="M22 12a10 10 0 00-10-10v4a6 6 0 016 6h4z"
                      />
                    </svg>

                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In

                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              {/* Divider */}

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>

                <div className="relative flex justify-center">
                  <span
                    className="
                      bg-white
                      px-5
                      text-sm
                      text-muted
                    "
                  >
                    OR CONTINUE WITH
                  </span>
                </div>
              </div>

              {/* Google Login */}

         <GoogleLogin
  onSuccess={handleGoogleLogin}
  onError={() => {
    setError("Google login failed. Please try again.");
  }}
/>

             

              {/* Register */}

              <div className="text-center">
                <p className="text-sm text-text-secondary">
                  Don't have an account?
                </p>

                <Link
                  to="/register"
                  className="
                    mt-3
                    inline-flex
                    h-12
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-primary
                    px-8
                    font-semibold
                    text-primary
                    transition-all
                    duration-300
                    hover:bg-primary
                    hover:text-white
                  "
                >
                  Create Free Account
                </Link>
              </div>

              {/* Footer */}

              <div className="border-t border-border pt-6">
                <div className="flex flex-wrap justify-center gap-6 text-sm text-muted">

                  <Link
                    to="/privacy"
                    className="hover:text-primary"
                  >
                    Privacy Policy
                  </Link>

                  <Link
                    to="/terms"
                    className="hover:text-primary"
                  >
                    Terms
                  </Link>

                  <Link
                    to="/contact"
                    className="hover:text-primary"
                  >
                    Contact
                  </Link>
                </div>

                <p className="mt-5 text-center text-xs text-muted">
                  © {new Date().getFullYear()} BizLaunch India.
                  <br />
                  Empowering Local Businesses with Modern Websites.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;