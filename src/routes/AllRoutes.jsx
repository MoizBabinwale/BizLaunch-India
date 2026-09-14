import { Routes, Route } from "react-router-dom";

/* ---------- Public Pages ---------- */

import Home from "../pages/Home";
import Pricing from "../pages/Pricing";
import BusinessList from "../pages/BusinessList";
import PublicBusiness from "../pages/PublicBusiness";

/* ---------- Auth ---------- */

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

/* ---------- Dashboard ---------- */

import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";

/* ---------- Admin ---------- */

import AdminDashboard from "../pages/admin/AdminDashboard";

/* ---------- Errors ---------- */

// import NotFound from "../pages/errors/NotFound";

/* ---------- Layouts ---------- */

import DashboardLayout from "../layouts/DashboardLayout";

/* ---------- Guards ---------- */

import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import AdminRoute from "./AdminRoute";
import ForgotPassword from "../pages/auth/ForgotPassword";
import BusinessHub from "../pages/BusinessHub";
import MyBusiness from "../pages/MyBusiness";

const AllRoutes = () => {
  return (
    <Routes>
      {/* ---------------- PUBLIC ROUTES ---------------- */}

      <Route path="/" element={<Home />} />

      <Route path="/pricing" element={<Pricing />} />

      <Route path="/explore" element={<BusinessList />} />

      <Route path="/business/:slug" element={<PublicBusiness />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ---------------- GUEST ROUTES ---------------- */}

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
      </Route>

      {/* ---------------- USER DASHBOARD ---------------- */}

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/operations" element={<BusinessHub />} />
          <Route path="/dashboard/my-business" element={<MyBusiness />} />
        </Route>
      </Route>

      {/* ---------------- ADMIN ---------------- */}

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* ---------------- 404 ---------------- */}

      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default AllRoutes;
