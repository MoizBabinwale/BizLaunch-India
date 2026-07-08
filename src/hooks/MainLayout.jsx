import React from "react";
import { Outlet } from "react-router-dom";

// Placeholder components - you can build these out next
const Navbar = () => (
  <header className="bg-card shadow-sm">
    <nav className="container mx-auto px-4 py-4">Navbar</nav>
  </header>
);
const Footer = () => (
  <footer className="bg-text-primary text-white">
    <div className="container mx-auto px-4 py-8">Footer</div>
  </footer>
);

const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
