import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { GoogleLogin } from "@react-oauth/google";

import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import AlertPopup from "../../components/common/AlertPopup";
import Spinner from "../../components/common/Spinner";

const Register = () => {
  const navigate = useNavigate();

  const { register, loginWithGoogleAuth } = useAuth();

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [acceptedTerms, setAcceptedTerms] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  //--------------------------------------------------
  // Handle Input Change
  //--------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  //--------------------------------------------------
  // Password Strength
  //--------------------------------------------------

  const passwordStrength = useMemo(() => {
    let score = 0;

    if (formData.password.length >= 8) score++;

    if (/[A-Z]/.test(formData.password)) score++;

    if (/[0-9]/.test(formData.password)) score++;

    if (/[^A-Za-z0-9]/.test(formData.password))
      score++;

    return score;
  }, [formData.password]);

  const strengthText = () => {
    if (passwordStrength === 0) return "";

    if (passwordStrength === 1)
      return "Very Weak";

    if (passwordStrength === 2)
      return "Weak";

    if (passwordStrength === 3)
      return "Good";

    return "Strong";
  };

  const strengthColor = () => {
    if (passwordStrength <= 1)
      return "bg-red-500";

    if (passwordStrength === 2)
      return "bg-yellow-500";

    if (passwordStrength === 3)
      return "bg-blue-500";

    return "bg-green-500";
  };

  //--------------------------------------------------
  // Validation
  //--------------------------------------------------

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    }

    if (formData.name.length < 2) {
      newErrors.name =
        "Name must contain at least 2 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Please enter a valid email.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone =
        "Phone number is required.";
    } else if (
      !/^[6-9]\d{9}$/.test(formData.phone)
    ) {
      newErrors.phone =
        "Enter a valid mobile number.";
    }

    if (!formData.password) {
      newErrors.password =
        "Password is required.";
    } else if (
      formData.password.length < 8
    ) {
      newErrors.password =
        "Password must be at least 8 characters.";
    }

    if (
      formData.confirmPassword !==
      formData.password
    ) {
      newErrors.confirmPassword =
        "Passwords do not match.";
    }

    if (!acceptedTerms) {
      newErrors.terms =
        "Please accept Terms & Conditions.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  //--------------------------------------------------
  // Register
  //--------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      setErrorMessage("");

      setSuccessMessage("");

      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      setSuccessMessage(
        "Registration successful!"
      );

      setTimeout(() => {
        navigate("/dashboard", {
          replace: true,
        });
      }, 1200);
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message ||
          err?.message ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async (credentialResponse) => {
    if (!acceptedTerms) {
      setErrors((prev) => ({
        ...prev,
        terms: "Please accept the Terms of Service and Privacy Policy first.",
      }));
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const credential = credentialResponse?.credential;
      if (!credential) {
        throw new Error("Google did not return a credential. Please try again.");
      }

      await loginWithGoogleAuth(credential);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message ||
          err?.message ||
          "Google sign-in failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Account | BizLaunch India</title>

        <meta
          name="description"
          content="Create your BizLaunch India account and launch your business website in minutes."
        />
      </Helmet>

      <div className="relative min-h-screen overflow-hidden bg-background">
                {/* Background Decorations */}

        <div className="absolute inset-0 overflow-hidden">

          <div
            className="
              absolute
              -left-32
              -top-32
              h-96
              w-96
              rounded-full
              bg-primary/10
              blur-3xl
            "
          />

          <div
            className="
              absolute
              right-0
              top-1/3
              h-[420px]
              w-[420px]
              rounded-full
              bg-accent-purple/10
              blur-3xl
            "
          />

          <div
            className="
              absolute
              bottom-0
              left-1/2
              h-[300px]
              w-[300px]
              -translate-x-1/2
              rounded-full
              bg-success/10
              blur-3xl
            "
          />

        </div>

        <div
          className="
            relative
            mx-auto
            flex
            min-h-screen
            max-w-7xl
            items-center
            justify-center
            px-6
            py-16
          "
        >

          <div
            className="
              grid
              w-full
              overflow-hidden
              rounded-[32px]
              border
              border-border
              bg-card/95
              shadow-2xl
              backdrop-blur-xl
              lg:grid-cols-2
            "
          >

            {/* ===========================
                 LEFT SIDE
            =========================== */}

            <div
              className="
                relative
                hidden
                overflow-hidden
                bg-gradient-to-br
                from-primary
                via-primary-dark
                to-accent-purple
                p-12
                text-white
                lg:flex
                lg:flex-col
                lg:justify-between
              "
            >

              <div
                className="
                  absolute
                  -right-24
                  -top-24
                  h-72
                  w-72
                  rounded-full
                  bg-white/10
                "
              />

              <div
                className="
                  absolute
                  bottom-0
                  left-0
                  h-56
                  w-56
                  rounded-full
                  bg-white/5
                "
              />

              <div className="relative z-10">

                <Link
                  to="/"
                  className="inline-flex items-center gap-4"
                >

                  <div
                    className="
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-2xl
                      bg-white
                      text-3xl
                      font-bold
                      text-primary
                      shadow-xl
                    "
                  >
                    B
                  </div>

                  <div>

                    <h1
                      className="
                        font-display
                        text-3xl
                        font-bold
                      "
                    >
                      BizLaunch India
                    </h1>

                    <p className="mt-1 text-white/80">
                      Launch Your Business Online
                    </p>

                  </div>

                </Link>

                <div className="mt-20">

                  <span
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      bg-white/20
                      px-4
                      py-2
                      text-sm
                    "
                  >
                    <Sparkles size={18} />

                    India's Smart Business Platform
                  </span>

                  <h2
                    className="
                      mt-8
                      text-5xl
                      font-bold
                      leading-tight
                    "
                  >
                    Grow Your Business

                    <br />

                    With One Click.
                  </h2>

                  <p
                    className="
                      mt-8
                      max-w-md
                      text-lg
                      leading-8
                      text-white/80
                    "
                  >
                    Create your own professional business
                    website, receive enquiries, showcase
                    products, collect leads, manage customers,
                    and grow your business from a single
                    dashboard.
                  </p>

                </div>

              </div>

              <div className="relative z-10">

                <div className="space-y-5">

                  <div className="flex items-center gap-4">

                    <CheckCircle2
                      className="text-green-300"
                      size={22}
                    />

                    <span>
                      Professional Website Included
                    </span>

                  </div>

                  <div className="flex items-center gap-4">

                    <CheckCircle2
                      className="text-green-300"
                      size={22}
                    />

                    <span>
                      Free QR Code & WhatsApp Button
                    </span>

                  </div>

                  <div className="flex items-center gap-4">

                    <CheckCircle2
                      className="text-green-300"
                      size={22}
                    />

                    <span>
                      SEO Optimized Business Profile
                    </span>

                  </div>

                  <div className="flex items-center gap-4">

                    <CheckCircle2
                      className="text-green-300"
                      size={22}
                    />

                    <span>
                      Upgrade Anytime Without Losing Data
                    </span>

                  </div>

                  <div className="flex items-center gap-4">

                    <ShieldCheck
                      className="text-green-300"
                      size={22}
                    />

                    <span>
                      Secure Account & Cloud Backup
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* ===========================
                  RIGHT SIDE
            =========================== */}

            <div className="p-8 md:p-12">

              <div className="mb-8">

                <span
                  className="
                    inline-flex
                    items-center
                    rounded-full
                    bg-primary-sky
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-primary
                  "
                >
                  Create Your Account
                </span>

                <h2
                  className="
                    mt-5
                    text-4xl
                    font-display
                    font-bold
                    text-text-primary
                  "
                >
                  Start Building Today
                </h2>

                <p className="mt-3 text-text-secondary">

                  Join thousands of businesses already using
                  BizLaunch India.

                </p>

              </div>

              {errorMessage && (
                <AlertPopup
                  type="danger"
                  title="Registration Failed"
                  message={errorMessage}
                />
              )}

              {successMessage && (
                <AlertPopup
                  type="success"
                  title="Success"
                  message={successMessage}
                />
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >              {/* =========================
                    Full Name
              ========================== */}

              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-text-primary"
                >
                  Full Name
                </label>

                <div className="relative">

                  <User
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="John doe"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    className="
                      h-14
                      w-full
                      rounded-2xl
                      border
                      border-border
                      bg-background
                      pl-12
                      pr-4
                      text-text-primary
                      outline-none
                      transition-all
                      duration-300
                      focus:border-primary
                      focus:ring-4
                      focus:ring-primary/10
                    "
                  />

                </div>

                {errors.name && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.name}
                  </p>
                )}

              </div>

              {/* =========================
                    Email
              ========================== */}

              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-text-primary"
                >
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    className="
                      h-14
                      w-full
                      rounded-2xl
                      border
                      border-border
                      bg-background
                      pl-12
                      pr-4
                      text-text-primary
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
                  <p className="mt-2 text-sm text-red-500">
                    {errors.email}
                  </p>
                )}

              </div>

              {/* =========================
                    Phone
              ========================== */}

              <div>

                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-text-primary"
                >
                  Mobile Number
                </label>

                <div className="relative">

                  <Phone
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                    className="
                      h-14
                      w-full
                      rounded-2xl
                      border
                      border-border
                      bg-background
                      pl-12
                      pr-4
                      text-text-primary
                      outline-none
                      transition-all
                      duration-300
                      focus:border-primary
                      focus:ring-4
                      focus:ring-primary/10
                    "
                  />

                </div>

                {errors.phone && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.phone}
                  </p>
                )}

              </div>

              {/* =========================
                    Password
              ========================== */}

              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-text-primary"
                >
                  Password
                </label>

                <div className="relative">

                  <Lock
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    className="
                      h-14
                      w-full
                      rounded-2xl
                      border
                      border-border
                      bg-background
                      pl-12
                      pr-14
                      text-text-primary
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
                    onClick={() => setShowPassword(!showPassword)}
                    className="
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-muted
                      transition
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

                {/* Password Strength */}

                {formData.password && (

                  <div className="mt-4">

                    <div className="mb-2 flex items-center justify-between">

                      <span className="text-sm text-muted">
                        Password Strength
                      </span>

                      <span
                        className={`text-sm font-semibold ${
                          passwordStrength >= 4
                            ? "text-green-600"
                            : passwordStrength >= 3
                            ? "text-blue-600"
                            : passwordStrength >= 2
                            ? "text-yellow-600"
                            : "text-red-500"
                        }`}
                      >
                        {strengthText()}
                      </span>

                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-200">

                      <div
                        className={`h-full rounded-full transition-all duration-500 ${strengthColor()}`}
                        style={{
                          width: `${passwordStrength * 25}%`,
                        }}
                      />

                    </div>

                  </div>

                )}

                {errors.password && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.password}
                  </p>
                )}

              </div>
                            {/* =========================
                    Confirm Password
              ========================== */}

              <div>

                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-text-primary"
                >
                  Confirm Password
                </label>

                <div className="relative">

                  <Lock
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    className="
                      h-14
                      w-full
                      rounded-2xl
                      border
                      border-border
                      bg-background
                      pl-12
                      pr-14
                      text-text-primary
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
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
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
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>

                </div>

                {formData.confirmPassword &&
                  formData.password ===
                    formData.confirmPassword && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle2 size={18} />
                      Passwords match
                    </div>
                  )}

                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}

              </div>

              {/* =========================
                    Terms
              ========================== */}

              <div>

                <label className="flex cursor-pointer items-start gap-3">

                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) =>
                      setAcceptedTerms(e.target.checked)
                    }
                    className="
                      mt-1
                      h-4
                      w-4
                      rounded
                      border-border
                      text-primary
                      focus:ring-primary
                    "
                  />

                  <span className="text-sm leading-6 text-text-secondary">

                    I agree to the{" "}

                    <Link
                      to="/terms"
                      className="font-semibold text-primary hover:text-primary-dark"
                    >
                      Terms of Service
                    </Link>

                    {" "}and{" "}

                    <Link
                      to="/privacy"
                      className="font-semibold text-primary hover:text-primary-dark"
                    >
                      Privacy Policy
                    </Link>

                  </span>

                </label>

                {errors.terms && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.terms}
                  </p>
                )}

              </div>

              {/* =========================
                    Register Button
              ========================== */}

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
                  shadow-primary/30
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
                    <Spinner size="sm" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Free Account
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

                  <span className="bg-card px-5 text-sm text-muted">
                    OR CONTINUE WITH
                  </span>

                </div>

              </div>

              {/* Google Signup */}

              <div className="flex min-h-14 items-center justify-center rounded-2xl border border-border bg-white p-1 shadow-sm transition hover:border-primary hover:shadow-lg">
                <GoogleLogin
                  onSuccess={handleGoogleSignup}
                  onError={() =>
                    setErrorMessage("Google sign-in failed. Please try again.")
                  }
                  text="continue_with"
                  shape="rectangular"
                  theme="outline"
                  size="large"
                  width="360"
                />
              </div>

              {/* Login */}

              <div className="pt-2 text-center">

                <p className="text-sm text-text-secondary">

                  Already have an account?

                </p>

                <Link
                  to="/login"
                  className="
                    mt-3
                    inline-flex
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-primary
                    px-8
                    py-3
                    font-semibold
                    text-primary
                    transition-all
                    duration-300
                    hover:bg-primary
                    hover:text-white
                  "
                >
                  Sign In
                </Link>

              </div>

              {/* Trust Badge */}

              <div className="rounded-2xl border border-border bg-background p-5">

                <div className="flex items-center gap-3">

                  <ShieldCheck
                    size={26}
                    className="text-green-600"
                  />

                  <div>

                    <h4 className="font-semibold text-text-primary">
                      Your Data is Safe
                    </h4>

                    <p className="mt-1 text-sm text-text-secondary">
                      Passwords are encrypted using bcrypt.
                      Your account is protected using JWT authentication
                      and secure server validation.
                    </p>

                  </div>

                </div>

              </div>

            </form>

          </div>

        </div>

      </div>
      </div>

    </>

  );

};

export default Register;
