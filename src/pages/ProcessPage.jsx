import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import styles from "../css/ProcessPage.module.css";

function ProcessPage() {
  const [showScroll, setShowScroll] = useState(false);
  
  // TikTok video data - using proper embed URLs with cleaned IDs
  const tiktokVideos = [
    {
      id: 1,
      videoId: "7424604834302545185",
      username: "martavieiraa"
    },
    {
      id: 2,
      videoId: "7473492953076436246",
      username: "martavieiraa"
    },
    {
      id: 3,
      videoId: "7473288771321072918",
      username: "martavieiraa"
    },
    {
      id: 4,
      videoId: "7473276138215705878",
      username: "martavieiraa"
    },
    {
      id: 5,
      videoId: "7472857689006083351",
      username: "martavieiraa"
    },
    {
      id: 6,
      videoId: "7455394970447416598",
      username: "martavieiraa"
    }
    // Add more videos as needed
  ];

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

  // Function to load TikTok embed script
  useEffect(() => {
    // First, clean up any existing script to avoid duplicates
    const existingScript = document.getElementById('tiktok-embed-script');
    if (existingScript) {
      existingScript.remove();
    }
    
    // Create and add the script
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.id = 'tiktok-embed-script';
    script.async = true;
    
    // Add the script to the document
    document.body.appendChild(script);
    
    // Clean up on unmount
    return () => {
      const scriptToRemove = document.getElementById('tiktok-embed-script');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  return (
    <div className={styles.processContainer}>
      <Header />
      
      <div className={styles.content}>
        <h1 className={styles.pageTitle}>Process</h1>
        
        <div className={styles.videoGrid}>
          {tiktokVideos.map((video) => (
            <div key={video.id} className={styles.videoCard}>
              <div className={styles.videoWrapper}>
                <iframe
                  src={`https://www.tiktok.com/embed/v2/${video.videoId}`}
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {showScroll && <ScrollToTop />}
      <Footer />
    </div>
  );
}

export default ProcessPage;