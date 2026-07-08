import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// import {
//   Mail,
//   Lock,
//   ArrowRight,
//   Chrome,
// } from "lucide-react";

import Button from "../common/Button";
import Input from "../common/Input";
import PasswordInput from "../common/PasswordInput";
import AlertPopup from "../common/AlertPopup";
import Spinner from "../common/Spinner";

const LoginForm = ({
  onSubmit,
  loading = false,
  errorMessage = "",
}) => {
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
    [name]: type === "checkbox" ? checked : value,
  }));
};

const validate = () => {
  const newErrors = {};

  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
  }

  if (!formData.password.trim()) {
    newErrors.password = "Password is required";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};

const handleSubmit = (e) => {
  e.preventDefault();

  if (!validate()) return;

  onSubmit(formData);
};

return (
<form
onSubmit={handleSubmit}
className="space-y-6"
>

        {/* Remember Me + Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input
            type="checkbox"
            className="rounded border-border text-primary focus:ring-primary"
          />
          Remember me
        </label>

        <button
          type="button"
          className="text-sm font-medium text-primary transition hover:text-primary-dark"
        >
          Forgot Password?
        </button>
      </div>

      {/* Login Button */}
      <Button
        type="submit"
        disabled={loading}
        className="flex h-12 w-full items-center justify-center rounded-xl"
      >
        {loading ? (
          <>
            <Spinner size="sm" />
            <span className="ml-2">Signing In...</span>
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>

        <div className="relative flex justify-center">
          <span className="bg-card px-4 text-sm text-muted">
            OR
          </span>
        </div>
      </div>

      {/* Google Login (Future) */}
      <button
        type="button"
        className="
          flex
          h-12
          w-full
          items-center
          justify-center
          gap-3
          rounded-xl
          border
          border-border
          bg-white
          font-medium
          text-text-primary
          transition-all
          duration-300
          hover:border-primary
          hover:shadow-md
        "
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="h-5 w-5"
        />

        Continue with Google
      </button>

      {/* Register */}
      <div className="text-center text-sm text-text-secondary">
        Don't have an account?{" "}
        <a
          href="/register"
          className="font-semibold text-primary hover:text-primary-dark"
        >
          Create one
        </a>
      </div>
    </form>
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  errorMessage: PropTypes.string,
};

export default LoginForm;