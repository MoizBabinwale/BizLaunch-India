import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/common/Loader";

const GuestRoute = () => {
  const { isLoggedIn, user, loading } = useAuth();

  // Wait until auth check is complete
  if (loading) {
    return <Loader fullScreen />;
  }

  // If user is already logged in, redirect them
  if (isLoggedIn) {
    // Redirect admins to admin dashboard
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    // Redirect all other users
    return <Navigate to="/dashboard" replace />;
  }

  // Allow guest pages (Login/Register/Forgot Password)
  return <Outlet />;
};

export default GuestRoute;
