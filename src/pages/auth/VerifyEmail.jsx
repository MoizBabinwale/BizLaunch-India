import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowRight, CheckCircle2, LoaderCircle, MailCheck } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../../api/authApi";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const requestRef = useRef({ token: null, promise: null });
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("This verification link is missing its security token.");
      return undefined;
    }

    setStatus("loading");
    setErrorMessage("");

    if (requestRef.current.token !== token) {
      requestRef.current = {
        token,
        promise: verifyEmail(token),
      };
    }

    let active = true;
    requestRef.current.promise
      .then(() => {
        if (active) setStatus("success");
      })
      .catch((error) => {
        if (active) {
          setErrorMessage(
            error.message || "We could not verify this email address."
          );
          setStatus("error");
        }
      });

    return () => {
      active = false;
    };
  }, [token]);

  return (
    <>
      <Helmet>
        <title>Verify your email | BizLaunch India</title>
        <meta
          name="description"
          content="Confirm your email address to finish setting up your BizLaunch India account."
        />
      </Helmet>

      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50 px-4 py-12">
        <section className="w-full max-w-xl rounded-3xl border border-slate-100 bg-white px-6 py-10 text-center shadow-xl shadow-slate-200/60 sm:px-12 sm:py-14">
          <Link to="/" aria-label="BizLaunch India home">
            <img
              src="/title-logo.png"
              alt="BizLaunch India"
              className="mx-auto mb-10 w-56 max-w-full"
            />
          </Link>

          {status === "loading" && (
            <>
              <LoaderCircle
                className="mx-auto mb-5 animate-spin text-blue-600"
                size={52}
                aria-hidden="true"
              />
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Verifying your email
              </h1>
              <p className="mt-3 leading-7 text-slate-600">
                Please wait while we securely confirm your email address.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2
                className="mx-auto mb-5 text-emerald-500"
                size={58}
                aria-hidden="true"
              />
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Your email is verified!
              </h1>
              <p className="mt-3 leading-7 text-slate-600">
                You’re all set. Your BizLaunch India account is ready to help
                your business grow.
              </p>
              <Link
                to="/login"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                Continue to BizLaunch India
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <MailCheck
                className="mx-auto mb-5 text-amber-500"
                size={58}
                aria-hidden="true"
              />
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                We couldn’t verify this email
              </h1>
              <p role="alert" className="mt-3 leading-7 text-slate-600">
                {errorMessage} The link may have expired or already been used.
                Please sign in or register again to get a fresh verification
                link.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                >
                  Go to sign in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
                >
                  Create an account
                </Link>
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
};

export default VerifyEmail;
