import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Home from "../components/Home";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

function HomePage() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.pageYOffset > 300) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 300) {
        setShowScroll(false);
      }
    };

    window.addEventListener("scroll", checkScrollTop);
    return () => {
      window.removeEventListener("scroll", checkScrollTop);
    };
  }, [showScroll]);

  return (
    <div>
      <Header />
      <Home />
      <Footer />
      {showScroll && <ScrollToTop />}
    </div>
  );
}

export default HomePage;
