import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import PortfolioPage from "./pages/PortfolioPage";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import VirtualGallery from "./pages/VirtualGallery";

const App = () => {
  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);
    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gallery" element={<PortfolioPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/virtual-gallery" element={<VirtualGallery />} />
          <Route path="/admin-marta-secret" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
