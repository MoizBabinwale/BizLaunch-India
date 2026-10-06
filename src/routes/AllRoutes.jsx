import { Routes, Route } from "react-router-dom";

/* ---------- Public Pages ---------- */

import Home from "../pages/HomeDiscovery";
import BusinessList from "../pages/BusinessList";
import PublicBusiness from "../pages/PublicBusinessPage";
import About from "../pages/About";
import Contact from "../pages/Contact";
import FreeListing from "../pages/FreeListing";
import Advertise from "../pages/Advertise";
import DownloadApp from "../pages/DownloadApp";

/* ---------- Auth ---------- */

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

/* ---------- Dashboard ---------- */

import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";

/* ---------- Admin ---------- */

import AdminDashboard from "../pages/admin/AdminDashboard";

/* ---------- Errors ---------- */

import NotFound from "../pages/errors/NotFound";

/* ---------- Layouts ---------- */

import DashboardLayout from "../layouts/DashboardLayout";

/* ---------- Guards ---------- */

import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import AdminRoute from "./AdminRoute";
import ForgotPassword from "../pages/auth/ForgotPassword";
import BusinessHub from "../pages/BusinessHubReal";
import MyBusiness from "../pages/MyBusinessPage";
import ResetPassword from "../pages/auth/ResetPassword";
import LegalPage from "../pages/LegalPage";
import Enquiries from "../pages/Enquiries";

const AllRoutes = () => {
  return (
    <Routes>
      {/* ---------------- PUBLIC ROUTES ---------------- */}

      <Route path="/" element={<Home />} />


      <Route path="/explore" element={<BusinessList />} />

      <Route path="/business/:slug" element={<PublicBusiness />} />

      <Route path="/about" element={<About />} />

      <Route path="/contact" element={<Contact />} />

      <Route path="/free-listing" element={<FreeListing />} />

      <Route path="/advertise" element={<Advertise />} />

      <Route path="/download-app" element={<DownloadApp />} />

      <Route path="/terms" element={<LegalPage type="terms" />} />
      <Route path="/privacy" element={<LegalPage type="privacy" />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ---------------- GUEST ROUTES ---------------- */}

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword/>} />
      </Route>

      {/* ---------------- USER DASHBOARD ---------------- */}

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/operations" element={<BusinessHub />} />
          <Route path="/dashboard/my-business" element={<MyBusiness />} />
          <Route path="/dashboard/enquiries" element={<Enquiries />} />
        </Route>
      </Route>

      {/* ---------------- ADMIN ---------------- */}

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* ---------------- 404 ---------------- */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AllRoutes;
