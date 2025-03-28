import React, { useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import PortfolioPage from "./pages/PortfolioPage";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";

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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
