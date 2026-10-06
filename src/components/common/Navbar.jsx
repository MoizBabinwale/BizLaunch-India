import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Briefcase,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  Shield,
  User,
} from "lucide-react";

import DirectorySearchBar from "../directory/DirectorySearchBar";
import { COMPANY } from "../../config/directory";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Explore", path: "/explore" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const BROWSE_LINKS = [
  { name: "Download App", path: "/download-app" },
  { name: "Free Listing", path: "/free-listing" },
  { name: "Advertise", path: "/advertise" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const profileRef = useRef(null);
  const browseRef = useRef(null);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
    setBrowseOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (browseRef.current && !browseRef.current.contains(event.target)) {
        setBrowseOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const navClass = ({ isActive }) =>
    `whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-slate-900 text-white shadow-sm"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <header
      className={`sticky top-0 z-40 border-b border-transparent transition-all duration-300 ${
        scrolled ? "border-slate-200/80 bg-white/80 shadow-[0_4px_32px_rgba(15,23,42,0.06)] backdrop-blur-xl" : "bg-white/70 backdrop-blur-sm"
      }`}
    >
      <div className="hidden border-b border-slate-200/80 bg-slate-50/80 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 text-[11px] font-medium tracking-[0.12em] text-slate-500 uppercase">
          <p className="normal-case tracking-[0.02em] text-slate-600">
            One-stop destination for local businesses and services across India
          </p>

          <div className="flex items-center gap-5 normal-case tracking-[0.01em]">
            <Link to="/free-listing" className="transition hover:text-primary">
              List your business for free
            </Link>
            {COMPANY.helpline && (
              <>
                <span className="h-3 w-px bg-slate-300" />
                <a
                  href={`tel:${COMPANY.helpline.replace(/\D/g, "")}`}
                  className="transition hover:text-primary"
                >
                  {COMPANY.helpline}
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="BizLaunch India home">
           <img src={logo} alt="BizLaunch" className="h-16 w-52 drop-shadow-sm" />
          </Link>

          <div className="hidden min-w-0 flex-1 md:block">
            <DirectorySearchBar size="sm" />
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={navClass}
                end={item.path === "/"}
              >
                {item.name}
              </NavLink>
            ))}

            <div className="relative" ref={browseRef}>
              <button
                type="button"
                onClick={() => setBrowseOpen(!browseOpen)}
                className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                More
                <ChevronDown size={15} className={`${browseOpen ? "rotate-180" : ""} transition-transform`} />
              </button>

              {browseOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1 shadow-soft">
                  {BROWSE_LINKS.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 transition hover:bg-primary-sky hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/free-listing"
              className="hidden items-center gap-1.5 rounded-full bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-dark md:flex"
            >
              <PlusCircle size={16} />
              Free Listing
            </Link>

            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  aria-label="Account menu"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white shadow-sm transition hover:scale-[1.02]"
                >
                  {(user?.name || "U").charAt(0).toUpperCase()}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
                    <div className="border-b border-slate-200 px-4 py-3">
                      <p className="truncate font-semibold text-slate-900">
                        {user?.name}
                      </p>
                      <p className="truncate text-xs capitalize text-slate-500">
                        {user?.role?.replace("_", " ")}
                      </p>
                    </div>

                    {[
                      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
                      { to: "/dashboard/my-business", label: "My Business", icon: Briefcase },
                      { to: "/dashboard/profile", label: "Profile", icon: User },
                    ].map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 transition hover:bg-primary-sky hover:text-primary"
                      >
                        <item.icon size={16} />
                        {item.label}
                      </Link>
                    ))}

                    {user?.role === "admin" && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 transition hover:bg-primary-sky hover:text-primary"
                      >
                        <Shield size={16} />
                        Admin Panel
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 border-t border-slate-200 px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  to="/login"
                  className="rounded-full px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition hover:text-primary"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-slate-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Sign up
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm lg:hidden"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        <div className="mt-3 md:hidden">
          <DirectorySearchBar size="sm" />
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white/90 lg:hidden">
          <div className="space-y-1 px-6 py-4">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            <div className="my-2 border-t border-slate-200" />

            {BROWSE_LINKS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
              >
                {item.label}
              </Link>
            ))}

            <div className="my-2 border-t border-slate-200" />

            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="block rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/dashboard/my-business"
                  className="mt-2 block rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-medium text-slate-700"
                >
                  My Business
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 w-full rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

