import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-lg shadow-sm z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-10">
          <Link to="/" className="text-2xl font-bold text-text-primary font-display">
            BizLaunch
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-slate-600 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/pricing" className="text-slate-600 hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link to="/explore" className="text-slate-600 hover:text-primary transition-colors">
              Explore
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="text-slate-600 hover:text-primary transition-colors">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-lg text-sm font-semibold"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-slate-600 hover:text-primary transition-colors font-medium">
              Login
            </Link>
            <Link to="/register" className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm">
              Register
            </Link>
          </>
        )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
                </Link>
              )}
              <span className="text-gray-400">Hello, {user.name}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">
                Login
              </Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;