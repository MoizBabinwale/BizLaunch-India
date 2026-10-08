import "./App.css";
import { useLocation } from "react-router-dom";

import Navbar from "./components/common/Navbar";
import AllRoutes from "./routes/AllRoutes";
import AlertPopup from "./components/common/AlertPopup";
import Footer from "./components/common/Footer";

function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const isEmailVerification = location.pathname === "/verify-email";

  return (
    <>
      {!isDashboard && !isEmailVerification && <Navbar />}

      <main className={isDashboard ? "bg-background" : "min-h-screen bg-background"}>
        <AllRoutes />
      </main>

      {!isDashboard && !isEmailVerification && <Footer />}
      <AlertPopup />
    </>
  );
}

export default App;
