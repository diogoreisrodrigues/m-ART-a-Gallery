import React, { useState, useEffect } from "react";
import PortfolioCSS from "../css/Portfolio.module.css";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import PaintingPopup from "./PaintingPopup";

function Portfolio() {
  const [selectedPainting, setSelectedPainting] = useState(null);
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setPaintings(data);
      } catch (err) {
        console.error('Error fetching paintings:', err);
        setError('Failed to load paintings. Please try again later.');
      } finally {
        setLoading(false);
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
    const body = `Hi Marta,\n\nI'm interested in your artwork titled "${painting.title}".\n\nCould you please provide more information about it?\n\nThank you!`;
    
    window.location.href = `mailto:${encodeURIComponent("martavieira142004@gmail.com")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (loading) {
    return <div className={PortfolioCSS.loading}>Loading gallery...</div>;
  }

  if (error) {
    return <div className={PortfolioCSS.error}>{error}</div>;
  }

  // Split paintings into three columns for masonry layout
  const column1 = paintings.filter((_, i) => i % 3 === 0);
  const column2 = paintings.filter((_, i) => i % 3 === 1);
  const column3 = paintings.filter((_, i) => i % 3 === 2);

  return (
    <div className={PortfolioCSS.masonryContainer}>
      <div className={PortfolioCSS.masonryColumn}>
        {column1.map((painting) => (
          <ImageWrapper 
            key={painting.id} 
            src={painting.image_url} 
            index={painting.id}
            onClick={() => handleImageClick(painting)}
          />
        ))}
      </div>
      <div className={PortfolioCSS.masonryColumn}>
        {column2.map((painting) => (
          <ImageWrapper 
            key={painting.id} 
            src={painting.image_url} 
            index={painting.id}
            onClick={() => handleImageClick(painting)}
          />
        ))}
      </div>
      
      <div className={PortfolioCSS.masonryColumn}>
        {column3.map((painting) => (
          <ImageWrapper 
            key={painting.id} 
            src={painting.image_url} 
            index={painting.id}
            onClick={() => handleImageClick(painting)}
          />
        ))}
      </div>
      
      {selectedPainting && (
        <PaintingPopup 
          painting={{
            ...selectedPainting,
            imageSource: selectedPainting.image_url
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
        alt={`Portfolio ${index}`}
        className={PortfolioCSS.image}
        draggable="false"
      />
    </motion.div>
  );
}

export default Portfolio;
