import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { resetPassword } = useAuth();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError("Invalid or missing password reset link.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await resetPassword(token, password);

      setSuccess(
        "Your password has been reset successfully. You can now log in with your new password."
      );

      setPassword("");
      setConfirmPassword("");

      // Optional: redirect after a short delay
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2500);
    } catch (err) {
      console.error("Reset password error:", err);

      setError(
        err?.message ||
          "Unable to reset your password. The link may have expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2"
          >
            <div className="w-11 h-11 rounded-xl bg-[#3BB149] flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl">B</span>
            </div>

            <div className="text-left">
              <h1 className="text-xl font-bold text-slate-800 leading-none">
                BizLaunch
              </h1>

              <p className="text-xs text-[#3BB149] font-medium mt-1">
                India
              </p>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-7 sm:p-8">
          {/* Header */}
          <div className="text-center mb-7">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-[#3BB149]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-slate-800">
              Create new password
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Choose a strong password for your BizLaunch India account.
            </p>
          </div>

          {/* Missing token */}
          {!token ? (
            <div>
              <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-700">
                This password reset link is invalid or missing a reset token.
                Please request a new password reset link.
              </div>

              <Link
                to="/forgot-password"
                className="mt-5 w-full inline-flex items-center justify-center rounded-xl bg-[#3BB149] hover:bg-[#329c40] text-white font-semibold py-3 transition"
              >
                Request New Link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error */}
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-700">
                  {success}
                </div>
              )}

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  New password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    disabled={loading || !!success}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-slate-800 outline-none transition focus:border-[#3BB149] focus:ring-2 focus:ring-green-100 disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <p className="text-xs text-slate-400 mt-2">
                  Password must contain at least 8 characters.
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm new password
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    disabled={loading || !!success}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-slate-800 outline-none transition focus:border-[#3BB149] focus:ring-2 focus:ring-green-100 disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !!success}
                className="w-full rounded-xl bg-[#3BB149] hover:bg-[#329c40] text-white font-semibold py-3.5 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Resetting password..." : "Reset password"}
              </button>

              {/* Back to login */}
              <div className="text-center pt-1">
                <Link
                  to="/login"
                  className="text-sm font-medium text-[#3BB149] hover:underline"
                >
                  ← Back to login
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          © {new Date().getFullYear()} BizLaunch India. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;