import React, { useState, useEffect } from "react";
import PortfolioCSS from "../css/Portfolio.module.css";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import PaintingPopup from "./PaintingPopup";
import LoadingScreen from "./LoadingScreen";
// Import your local data as a fallback
import PaintingsData from "../data/PaintingsData";

function Portfolio() {
  const [selectedPainting, setSelectedPainting] = useState(null);
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    // Fetch paintings from our serverless function
    const fetchPaintings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/.netlify/functions/get-paintings');
        
        if (!response.ok) {
          throw new Error('Failed to fetch paintings');
        }
        
        const data = await response.json();
        if (data && data.length > 0) {
          setPaintings(data);
        } else {
          // If no paintings from API, use local data
          console.log('No paintings from API, using local data');
          setUsingFallback(true);
          setPaintings(PaintingsData || []);
        }
      } catch (err) {
        console.error('Error fetching paintings:', err);
        setError('Using local paintings data as fallback.');
        setUsingFallback(true);
        // Use local data as fallback
        setPaintings(PaintingsData || []);
      } finally {
        // Add a slight delay to make the loading screen visible even on fast connections
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };

    fetchPaintings();
  }, []);

  const handleImageClick = (painting) => {
    setSelectedPainting(painting);
  };

  const handleClosePopup = () => {
    setSelectedPainting(null);
  };

  const handleInterest = (painting) => {
    const subject = `Interest in your artwork: ${painting.title}`;
    let body = `Hi Marta,\n\nI'm interested in your artwork titled "${painting.title}"`;
    
    if (painting.dimensions) {
      body += ` (${painting.dimensions})`;
    }
    
    if (painting.price) {
      body += ` priced at €${painting.price}`;
    }
    
    body += `.\n\nCould you please provide more information about it?\n\nThank you!`;
    
    window.location.href = `mailto:${encodeURIComponent("martavieira142004@gmail.com")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error && !usingFallback) {
    return <div className={PortfolioCSS.error}>{error}</div>;
  }

  if (paintings.length === 0) {
    return <div className={PortfolioCSS.message}>No paintings to display yet. Visit the admin page to add some!</div>;
  }

  // Split paintings into three columns for masonry layout
  const column1 = paintings.filter((_, i) => i % 3 === 0);
  const column2 = paintings.filter((_, i) => i % 3 === 1);
  const column3 = paintings.filter((_, i) => i % 3 === 2);

  return (
    <div className={PortfolioCSS.masonryContainer}>
      {usingFallback && (
        <div className={PortfolioCSS.fallbackMessage}>
          Using local data - API connection not available
        </div>
      )}
      <div className={PortfolioCSS.masonryColumn}>
        {column1.map((painting, idx) => (
          <ImageWrapper 
            key={painting.id || idx} 
            src={usingFallback ? require(`../assets/images/${painting.path}`) : painting.image_url} 
            index={idx}
            onClick={() => handleImageClick(painting)}
          />
        ))}
      </div>
      <div className={PortfolioCSS.masonryColumn}>
        {column2.map((painting, idx) => (
          <ImageWrapper 
            key={painting.id || idx} 
            src={usingFallback ? require(`../assets/images/${painting.path}`) : painting.image_url} 
            index={idx}
            onClick={() => handleImageClick(painting)}
          />
        ))}
      </div>
      
      <div className={PortfolioCSS.masonryColumn}>
        {column3.map((painting, idx) => (
          <ImageWrapper 
            key={painting.id || idx} 
            src={usingFallback ? require(`../assets/images/${painting.path}`) : painting.image_url} 
            index={idx}
            onClick={() => handleImageClick(painting)}
          />
        ))}
      </div>
      
      {selectedPainting && (
        <PaintingPopup 
          painting={{
            ...selectedPainting,
            imageSource: usingFallback 
              ? require(`../assets/images/${selectedPainting.path}`) 
              : selectedPainting.image_url
          }} 
          onClose={handleClosePopup} 
          onInterest={handleInterest}
        />
      )}
    </div>
  );
}

function ImageWrapper({ src, index, onClick }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  React.useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1 });
    } else {
      controls.start({ opacity: 0 });
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeIn" }}
      className={PortfolioCSS.imageWrapper}
      onClick={onClick}
    >
      <img
        src={src}
        alt={`Portfolio ${index + 1}`}
        className={PortfolioCSS.image}
        draggable="false"
      />
    </motion.div>
  );
}

export default Portfolio;
