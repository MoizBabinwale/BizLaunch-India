import { useState, useEffect, useRef } from "react";
import {
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  User,
  Shield,
  LogOut,
  Briefcase,
  Search,
  Bell,
  PlusCircle,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

// ----------------------
// Navigation Links
// ----------------------



const  navigation= [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Explore",
    path: "/explore",
  },
  {
    name: "Pricing",
    path: "/pricing",
  },
  {
    name: "About",
    path: "/about",
  },
  {
    name: "Contact",
    path: "/contact",
  },
];
const  navLinks= [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Explore",
    path: "/explore",
  },
  {
    name: "Pricing",
    path: "/pricing",
  },
  {
    name: "About",
    path: "/about",
  },
  {
    name: "Contact",
    path: "/contact",
  },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoggedIn, user, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [navbarShadow, setNavbarShadow] = useState(false);

  const profileRef = useRef(null);
  const mobileRef = useRef(null);

  // ----------------------
  // Close menus on route change
  // ----------------------

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  // ----------------------
  // Navbar shadow on scroll
  // ----------------------

  useEffect(() => {
    const handleScroll = () => {
      setNavbarShadow(window.scrollY > 15);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ----------------------
  // Close dropdown when clicking outside
  // ----------------------

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }

      if (
        mobileRef.current &&
        !mobileRef.current.contains(event.target)
      ) {
        setMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ----------------------
  // Logout
  // ----------------------

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------------
  // Active Nav Styling
  // ----------------------

  const navClass = ({ isActive }) =>
    `
      relative
      px-4
      py-2
      text-sm
      font-semibold
      transition-all
      duration-300

      ${
        isActive
          ? "text-primary"
          : "text-text-secondary hover:text-primary"
      }

      after:absolute
      after:left-0
      after:-bottom-1
      after:h-[2px]
      after:bg-primary
      after:transition-all
      after:duration-300

      ${
        isActive
          ? "after:w-full"
          : "after:w-0 hover:after:w-full"
      }
    `;

  // ----------------------
  // Avatar
  // ----------------------

  const avatar =
    user?.avatar ||
    `https://ui-avatars.com/api/?background=2563EB&color=fff&bold=true&name=${encodeURIComponent(
      user?.name || "User"
    )}`;

  return (
    <>
    <header
      className={`sticky top-0 z-50 transition-all duration-300
      ${
        navbarShadow
          ? "border-b border-border bg-white/95 shadow-lg backdrop-blur-xl"
          : "bg-white/80 backdrop-blur-xl"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                {/* ===========================
            Logo
        =========================== */}

        <Link
          to="/"
          className="flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-xl font-bold text-white shadow-lg shadow-primary/30">
            B
          </div>

          <div className="hidden sm:block">
            <h1 className="font-display text-xl font-extrabold tracking-tight text-text-primary">
              BizLaunch India
            </h1>

            <p className="text-xs font-medium text-muted">
              Launch Your Business Online
            </p>
          </div>
        </Link>

        {/* ===========================
            Desktop Navigation
        =========================== */}

        <nav className="hidden items-center gap-2 lg:flex">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={navClass}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* ===========================
            Right Side
        =========================== */}

        <div className="hidden items-center gap-4 lg:flex">

          {/* Search */}

          <button
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              border-border
              bg-card
              transition-all
              duration-300
              hover:border-primary
              hover:bg-primary-sky
            "
          >
            <Search size={19} />
          </button>

          {/* Notification */}

          {isLoggedIn && (
            <button
              className="
                relative
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                border-border
                bg-card
                transition-all
                duration-300
                hover:border-primary
                hover:bg-primary-sky
              "
            >
              <Bell size={19} />

              <span
                className="
                  absolute
                  right-2
                  top-2
                  h-2
                  w-2
                  rounded-full
                  bg-danger
                "
              />
            </button>
          )}

          {/* Guest Buttons */}

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="
                  rounded-xl
                  px-5
                  py-2.5
                  font-semibold
                  text-text-secondary
                  transition-all
                  duration-300
                  hover:bg-primary-sky
                  hover:text-primary
                "
              >
                Login
              </Link>

              <Link
                to="/register"
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-primary
                  px-6
                  py-3
                  font-semibold
                  text-white
                  shadow-lg
                  shadow-primary/30
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-primary-dark
                "
              >
                <PlusCircle size={18} />

                Launch Business
              </Link>
            </>
         ) : (
  <>
    {/* Launch Business */}

    {user?.role !== "business_owner" &&
      user?.role !== "admin" && (
        <Link
          to="/create-business"
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-primary
            px-5
            py-3
            font-semibold
            text-white
            shadow-lg
            shadow-primary/30
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:bg-primary-dark
          "
        >
          <Briefcase size={18} />
          Launch Business
        </Link>
      )}

    {/* Profile Dropdown */}

    <div
      className="relative"
      ref={profileRef}
    >
      <button
        onClick={() => setProfileOpen(!profileOpen)}
        className="
          flex
          items-center
          gap-3
          rounded-2xl
          border
          border-border
          bg-card
          px-3
          py-2
          shadow-sm
          transition-all
          duration-300
          hover:border-primary
          hover:shadow-md
        "
      >
        <img
          src={avatar}
          alt={user?.name}
          className="h-11 w-11 rounded-full object-cover"
        />

        <div className="text-left">
          <h4 className="text-sm font-bold text-text-primary">
            {user?.name}
          </h4>

          <p className="text-xs capitalize text-muted">
            {user?.role?.replace("_", " ")}
          </p>
        </div>

        <ChevronDown
          size={18}
          className={`transition-transform duration-300 ${
            profileOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}

      {profileOpen && (
        <div
          className="
            absolute
            right-0
            mt-3
            w-72
            overflow-hidden
            rounded-2xl
            border
            border-border
            bg-white
            shadow-2xl
            z-50
          "
        >
          <Link
            to="/dashboard"
            onClick={() => setProfileOpen(false)}
            className="flex items-center gap-3 px-5 py-4 text-sm transition hover:bg-primary-sky"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            to="/profile"
            onClick={() => setProfileOpen(false)}
            className="flex items-center gap-3 px-5 py-4 text-sm transition hover:bg-primary-sky"
          >
            <User size={18} />
            Profile
          </Link>

          <Link
            to="/my-business"
            onClick={() => setProfileOpen(false)}
            className="flex items-center gap-3 px-5 py-4 text-sm transition hover:bg-primary-sky"
          >
            <Briefcase size={18} />
            My Business
          </Link>

          {user?.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setProfileOpen(false)}
              className="flex items-center gap-3 px-5 py-4 text-sm transition hover:bg-primary-sky"
            >
              <Shield size={18} />
              Admin Panel
            </Link>
          )}

          <div className="my-1 border-t border-border" />

          <button
            onClick={handleLogout}
            className="
              flex
              w-full
              items-center
              gap-3
              px-5
              py-4
              text-sm
              font-semibold
              text-red-600
              transition
              hover:bg-red-50
            "
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </div>
  </>
)}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-xl border border-border p-2 transition hover:bg-primary-sky lg:hidden"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ================= Mobile Menu ================= */}

      {mobileOpen && (
        <div className="border-t border-border bg-white lg:hidden">
          <div className="space-y-2 px-6 py-5">

            {navLinks.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-text-secondary hover:bg-primary-sky"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl border border-border px-4 py-3 text-center font-medium"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl bg-primary px-4 py-3 text-center font-semibold text-white"
                >
                  Get Started Free
                </Link>
              </>
            ) : (
              <>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="font-semibold text-text-primary">
                    {user?.name}
                  </p>

                  <p className="text-sm text-muted capitalize">
                    {user?.role}
                  </p>
                </div>

                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl bg-primary px-4 py-3 text-center font-semibold text-white"
                >
                  Dashboard
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl border border-border px-4 py-3 text-center"
                >
                  Profile
                </Link>

                <Link
                  to="/my-business"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl border border-border px-4 py-3 text-center"
                >
                  My Business
                </Link>

                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-xl border border-border px-4 py-3 text-center"
                  >
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full rounded-xl border border-red-200 px-4 py-3 font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
    </>
  );
}