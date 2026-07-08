import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import {
  Mail,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import { forgotPassword } from "../../api/authApi";
import AlertPopup from "../../components/common/AlertPopup";
import Spinner from "../../components/common/Spinner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errors, setErrors] = useState({});

  //---------------------------------------
  // Validation
  //---------------------------------------

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email =
        "Email address is required.";
    }

    if (
      email &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
        email
      )
    ) {
      newErrors.email =
        "Enter a valid email address.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  //---------------------------------------
  // Submit
  //---------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      setErrorMessage("");

      setSuccessMessage("");

      await forgotPassword({
        email,
      });

      setSuccessMessage(
        "Password reset link has been sent to your email."
      );
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to send reset email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          Forgot Password | BizLaunch India
        </title>

        <meta
          name="description"
          content="Reset your BizLaunch India password."
        />
      </Helmet>

      <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-10">

        <div className="absolute inset-0 overflow-hidden">

          <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent-purple/10 blur-3xl" />

        </div>

        <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-10 shadow-2xl">

          <div className="mb-8 text-center">

            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white">
                B
              </div>

              <div className="text-left">

                <h1 className="font-display text-2xl font-bold text-text-primary">
                  BizLaunch India
                </h1>

                <p className="text-sm text-muted">
                  Launch Your Business Online
                </p>

              </div>

            </Link>

          </div>

          <div className="mb-8 text-center">

            <ShieldCheck
              className="mx-auto mb-5 text-primary"
              size={60}
            />

            <h2 className="font-display text-3xl font-bold text-text-primary">
              Forgot Password?
            </h2>

            <p className="mt-4 leading-7 text-text-secondary">
              Enter your registered email address.
              We'll send you a secure password
              reset link.
            </p>

          </div>

          {errorMessage && (
            <AlertPopup
              type="danger"
              title="Request Failed"
              message={errorMessage}
            />
          )}

          {successMessage && (
            <AlertPopup
              type="success"
              title="Email Sent"
              message={successMessage}
            />
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >            {/* ===========================
                    Email
            =========================== */}

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
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
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

            {/* ===========================
                    Submit Button
            =========================== */}

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
                font-semibold
                text-white
                shadow-lg
                shadow-primary/30
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-primary-dark
                hover:shadow-xl
                disabled:cursor-not-allowed
                disabled:opacity-70
              "
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  Sending Reset Link...
                </>
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            {/* Divider */}

            <div className="relative py-2">

              <div className="absolute inset-0 flex items-center">

                <div className="w-full border-t border-border" />

              </div>

              <div className="relative flex justify-center">

                <span className="bg-card px-4 text-sm text-muted">
                  NEED HELP?
                </span>

              </div>

            </div>

            {/* Back to Login */}

            <Link
              to="/login"
              className="
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-3
                rounded-2xl
                border
                border-primary
                bg-white
                font-semibold
                text-primary
                transition-all
                duration-300
                hover:bg-primary
                hover:text-white
              "
            >
              <ArrowLeft size={18} />

              Back to Login

            </Link>

            {/* Security Card */}

            <div
              className="
                rounded-2xl
                border
                border-border
                bg-background
                p-6
              "
            >

              <div className="flex items-start gap-4">

                <CheckCircle2
                  size={30}
                  className="mt-1 text-success"
                />

                <div>

                  <h4 className="font-semibold text-text-primary">
                    Security Reminder
                  </h4>

                  <ul className="mt-3 space-y-2 text-sm leading-6 text-text-secondary">

                    <li>
                      • The reset link expires in a limited
                      time.
                    </li>

                    <li>
                      • Never share your password with
                      anyone.
                    </li>

                    <li>
                      • Always choose a strong password with
                      uppercase, lowercase, numbers and
                      symbols.
                    </li>

                    <li>
                      • If you didn't request a password
                      reset, you can safely ignore the email.
                    </li>

                  </ul>

                </div>

              </div>

            </div>

            {/* Contact Support */}

            <div className="text-center">

              <p className="text-sm text-text-secondary">

                Didn't receive the email?

              </p>

              <button
                type="button"
                className="
                  mt-3
                  font-semibold
                  text-primary
                  transition
                  hover:text-primary-dark
                "
              >
                Contact Support
              </button>

            </div>

          </form>

        </div>

      </div>

    </>

  );

};

export default ForgotPassword;