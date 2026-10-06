import { useState } from "react";
import { Link, Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Package,
  Wrench,
  MessageSquare,
  User,
  Settings,
  BarChart3,
  Shield,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
      isActive
        ? "bg-primary text-white shadow-md"
        : "text-text-secondary hover:bg-primary-sky hover:text-primary"
    }`;

  return (
    <div className="min-h-screen bg-background">
      {/* ================= Sidebar ================= */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          h-screen
          w-72
          border-r
          border-border
          flex
          flex-col
          bg-card
          transition-transform
          duration-300
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}

        <Link
          to="/"
          aria-label="Go to BizLaunch India home page"
          className="flex h-20 items-center gap-3 border-b border-border px-6 transition hover:bg-primary-sky/50"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-xl font-bold text-white">
            B
          </div>

          <div>
            <h2 className="font-display text-lg font-bold">
              BizLaunch India
            </h2>

            <p className="text-xs text-muted">
              Business Dashboard
            </p>
          </div>
        </Link>

        {/* Navigation */}

        <nav className="flex-1 space-y-2 overflow-y-auto p-5">
          <NavLink to="/dashboard" end className={navClass}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          <NavLink to="/dashboard/my-business" className={navClass}>
            <Briefcase size={20} />
            My Business
          </NavLink>

          <NavLink to="/dashboard/products" className={navClass}>
            <Package size={20} />
            Products
          </NavLink>

          <NavLink to="/dashboard/services" className={navClass}>
            <Wrench size={20} />
            Services
          </NavLink>

          <NavLink to="/dashboard/enquiries" className={navClass}>
            <MessageSquare size={20} />
            Enquiries
          </NavLink>

          <NavLink to="/dashboard/operations" className={navClass}>
            <BarChart3 size={20} />
            Shop operations
          </NavLink>

          <NavLink to="/dashboard/profile" className={navClass}>
            <User size={20} />
            Profile
          </NavLink>

          <NavLink to="/dashboard/settings" className={navClass}>
            <Settings size={20} />
            Settings
          </NavLink>

          {user?.role === "admin" && (
            <NavLink to="/admin" className={navClass}>
              <Shield size={20} />
              Admin Panel
            </NavLink>
          )}
        </nav>

        {/* Bottom */}

        <div className="shrink-0 border-t border-border bg-card p-5">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 py-3 font-semibold text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= Main ================= */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen flex-col lg:ml-72">
        {/* Header */}

        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-border bg-white px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              className="rounded-xl border border-border p-2 lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div>
              <h1 className="font-display text-2xl font-bold text-text-primary">
                Dashboard
              </h1>

              <p className="text-sm text-muted">
                Welcome back, {user?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?background=2563EB&color=fff&name=${encodeURIComponent(
                  user?.name || "User"
                )}`
              }
              alt={user?.name}
              className="h-11 w-11 rounded-full border object-cover"
            />

            <div className="hidden sm:block">
              <p className="font-semibold text-text-primary">
                {user?.name}
              </p>

              <p className="text-xs capitalize text-muted">
                {user?.role}
              </p>
            </div>
          </div>
        </header>

        {/* Page */}

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
