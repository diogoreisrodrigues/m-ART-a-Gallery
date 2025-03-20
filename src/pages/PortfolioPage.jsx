import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Portfolio from "../components/Portfolio";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

function PortfolioPage() {
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
      <Portfolio />
      <Footer />
      {showScroll && <ScrollToTop />}
    </div>
  );
}

export default PortfolioPage;
