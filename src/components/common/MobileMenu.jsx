import React from "react";
import { NavLink, Link } from "react-router-dom";
import PropTypes from "prop-types";

const MobileMenu = ({ isOpen, isLoggedIn, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="border-t border-border bg-white lg:hidden">
      <div className="space-y-1 px-6 py-5">
        <NavLink to="/" className="block rounded-lg p-3 hover:bg-primary-sky">
          Home
        </NavLink>
        <NavLink to="/explore" className="block rounded-lg p-3 hover:bg-primary-sky">
          Explore
        </NavLink>
        <NavLink to="/pricing" className="block rounded-lg p-3 hover:bg-primary-sky">
          Pricing
        </NavLink>
        <NavLink to="/about" className="block rounded-lg p-3 hover:bg-primary-sky">
          About
        </NavLink>
        <NavLink to="/contact" className="block rounded-lg p-3 hover:bg-primary-sky">
          Contact
        </NavLink>

        <div className="pt-4">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="block rounded-xl border border-border p-3 text-center font-medium">
                Login
              </Link>
              <Link to="/register" className="mt-3 block rounded-xl bg-primary p-3 text-center font-semibold text-white">
                Get Started Free
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="block rounded-xl bg-primary p-3 text-center font-semibold text-white">
                Go to Dashboard
              </Link>
              <button onClick={onLogout} className="mt-3 w-full rounded-xl border border-red-200 p-3 font-medium text-red-600">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

MobileMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool,
  onLogout: PropTypes.func.isRequired,
};

export default MobileMenu;
