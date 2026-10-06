import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Compass, Home, Search } from "lucide-react";

const SUGGESTIONS = [
  { label: "Explore all businesses", to: "/explore" },
  { label: "Restaurants near you", to: "/explore?category=Restaurants" },
  { label: "List your business free", to: "/free-listing" },
  { label: "Contact support", to: "/contact" },
];

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/explore", { replace: true }), 12000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Page Not Found | BizLaunch India</title>
        <meta
          name="description"
          content="The page you are looking for could not be found on BizLaunch India."
        />
      </Helmet>

      <main className="flex min-h-[70vh] items-center bg-background">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <p className="font-display text-7xl font-extrabold text-primary sm:text-8xl">
            404
          </p>

          <h1 className="mt-6 text-3xl font-bold text-text-primary sm:text-4xl">
            We could not find that page
          </h1>

          <p className="mt-4 text-text-secondary">
            The link may be broken, or the page may have been moved. Try
            searching for a business instead, or pick one of the links below.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-white transition hover:bg-primary-dark"
            >
              <Home size={18} />
              Back to home
            </Link>

            <Link
              to="/explore"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-6 py-3.5 font-semibold text-text-secondary transition hover:border-primary hover:text-primary"
            >
              <Search size={18} />
              Explore businesses
            </Link>
          </div>

          <div className="mt-12">
            <p className="text-sm font-semibold text-text-primary">
              Popular destinations
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {SUGGESTIONS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-3.5 text-left text-sm font-medium text-text-secondary transition hover:border-primary hover:bg-primary-sky hover:text-primary"
                >
                  {item.label}
                  <ArrowLeft
                    size={15}
                    className="shrink-0 rotate-180"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </div>

          <p className="mt-10 flex items-center justify-center gap-1.5 text-xs text-muted">
            <Compass size={14} />
            Redirecting you to all businesses in a moment
          </p>
        </div>
      </main>
    </>
  );
}
