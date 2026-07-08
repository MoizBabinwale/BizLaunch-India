import React, { useState } from "react";
import { Outlet, Link, NavLink } from "react-router-dom";
import { LayoutDashboard, User, Settings, Menu, X, Briefcase } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const sidebarNavItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard/profile", icon: User, label: "Profile" },
  { to: "/dashboard/settings", icon: Settings, label: "Settings" },
];

const Sidebar = () => (
  <aside className="flex h-full w-64 flex-col border-r border-border bg-card">
    <div className="flex h-16 items-center border-b border-border px-6">
      <Link to="/" className="flex items-center font-display text-xl font-bold">
        <Briefcase className="mr-2 h-6 w-6 text-primary" />
        <span>BizLaunch</span>
      </Link>
    </div>
    <nav className="flex-1 space-y-1 p-4">
      {sidebarNavItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          end
          className={({ isActive }) => `flex items-center rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-primary-sky text-primary" : "text-text-secondary hover:bg-gray-100"}`}
        >
          <item.icon className="mr-3 h-5 w-5" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  </aside>
);

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
      <button onClick={onMenuClick} className="text-muted hover:text-text-primary lg:hidden">
        <Menu size={24} />
      </button>
      <div className="flex flex-1 items-center justify-end space-x-4">
        <span className="text-sm">Welcome, {user?.name || "User"}</span>
        <button onClick={logout} className="text-sm font-medium text-primary hover:text-primary-dark">
          Logout
        </button>
      </div>
    </header>
  );
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="fixed inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex w-64 flex-1 flex-col bg-card">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-muted">
              <X size={24} />
            </button>
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
