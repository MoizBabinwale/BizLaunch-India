import React from "react";
import { Outlet } from "react-router-dom";
// Placeholder components for now. These would be moved to `src/components/dashboard/`
// Placeholder components for now. These would be moved to `src/components/dashboard/`
const DashboardSidebar = () => (
  <aside style={{ width: "250px", background: "#f4f4f5", padding: "1rem", borderRight: "1px solid #e4e4e7" }}>
    <h3>BizLaunch</h3>
    <nav>
      <ul>
        <li>Dashboard</li>
        <li>Profile</li>
        <li>Settings</li>
      </ul>
    </nav>
  </aside>
);

const DashboardLayout = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <DashboardSidebar />
      <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
