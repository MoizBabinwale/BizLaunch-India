import "./App.css";

import Navbar from "./components/common/Navbar";
import AllRoutes from "./routes/AllRoutes";
import AlertPopup from "./components/common/AlertPopup";

function App() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background">
        <AllRoutes />
      </main>

      <AlertPopup />
    </>
  );
}

export default App;
