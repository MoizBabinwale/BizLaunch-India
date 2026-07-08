import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Loader from "../components/common/Loader";

const ProtectedRoute = () => {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  // Wait until authentication check completes
  if (loading) {
    return <Loader fullScreen />;
  }

  // User is not authenticated
  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // User authenticated
  return <Outlet />;
};

export default ProtectedRoute;
