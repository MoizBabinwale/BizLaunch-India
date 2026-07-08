import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Briefcase, LayoutDashboard, User, Settings } from "lucide-react";

const sidebarNavItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard/profile", icon: User, label: "Profile" },
  { to: "/dashboard/settings", icon: Settings, label: "Settings" },
];

const Sidebar = () => {
  return (
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
};

export default Sidebar;
