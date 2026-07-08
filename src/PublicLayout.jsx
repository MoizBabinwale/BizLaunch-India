import { Outlet, useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext"; // We will use this later

const PublicLayout = () => {
  const navigate = useNavigate();
  // const { currentUser } = useAuth(); // Example for later
  const currentUser = null; // Placeholder

  return (
    <div className="shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-mark">BL</span>
          <span>
            <strong>BizLaunch India</strong>
            <small>Business in a box</small>
          </span>
        </Link>

        <nav className="nav">
          <Link to="/#features">Features</Link>
          <Link to="/#pricing">Pricing</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/login" className="nav-primary">
            {currentUser ? "Open account" : "Login"}
          </Link>
        </nav>
      </header>
      <Outlet />
    </div>
  );
};

export default PublicLayout;
