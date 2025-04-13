import React, { useState, useEffect } from "react";
import ScrollToTop from "../components/ScrollToTop";
import styles from "../css/Home.module.css";
import ImageCarousel from "../components/ImageCarousel";

// Import profile image
import profileImage from "../assets/profile/profile.jpeg"; // Update this path if needed

// You'll need to add these images to your project
import framedPortrait from "../assets/HomePaintings/portrait.png"; 
import framedBust from "../assets/HomePaintings/FireWater.png";
import framedFlowers from "../assets/HomePaintings/flowers.png";

// Import video files - you'll need to download these from TikTok and add them to your project
// Place them in a folder like src/assets/videos/
import video1 from "../assets/videos/tiktok1.mp4";
import video2 from "../assets/videos/tiktok2.mp4";
import video3 from "../assets/videos/tiktok3.mp4";

function Home() {
  const [showScroll, setShowScroll] = useState(false);
  const [tiktokVideos, setTiktokVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(true);

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

  // Load videos from local files instead of fetching from API
  useEffect(() => {
    // Local videos data
    const localVideos = [
      {
        id: 1,
        title: "Painting Process",
        videoSrc: video1,
        thumbnail: null, // Optional: Add thumbnail image
      },
      {
        id: 2,
        title: "Color Mixing",
        videoSrc: video2,
        thumbnail: null,
      },
      {
        id: 3,
        title: "Studio Tour",
        videoSrc: video3,
        thumbnail: null,
      }
    ];
    
    setTiktokVideos(localVideos);
    setLoadingVideos(false);
  }, []);

  return (
    <div className={styles.container}>
      
      {/* Gallery Section */}
      <section className={styles.gallerySection}>
        <div className={styles.featuredArt}>
          <div className={styles.leftFrameContainer}>
            <img src={framedPortrait} alt="Portrait painting" className={styles.framedPortrait} />
          </div>
          
          <div className={styles.quoteContainer}>
            <blockquote className={styles.quote}>
              "If I could say it in words there would be no reason to paint."
            </blockquote>
          </div>
          
          <div className={styles.rightFramesContainer}>
            <div className={styles.topRightFrame}>
              <img src={framedBust} alt="Abstract bust painting" className={styles.framedBust} />
            </div>
            <div className={styles.bottomRightFrame}>
              <img src={framedFlowers} alt="Flower painting" className={styles.framedFlowers} />
            </div>
          </div>
        </div>
      </section>
      
      {/* Works Section - Now using the carousel component */}
      <ImageCarousel />
      
      {/* About Section */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutContainer}>
          <div className={styles.aboutImageContainer}>
            <img src={profileImage} alt="Artist portrait" className={styles.aboutImage} />
          </div>
          <div className={styles.aboutContent}>
            <h2 className={styles.aboutHeading}>← Who Am I?</h2>
            <p className={styles.aboutText}>
              I'm Marta Vieira, an artist and student, inspired by the wild beauty of my Portuguese island home. My work captures its fleeting magic—waves, cliffs, and forests—through bold strokes and soft hues. Each piece reflects my heart. Welcome to my gallery.
            </p>
          </div>
        </div>
      </section>
      
      {/* Transition Element - Connecting the artist to the process */}
      <div className={styles.sectionConnector}>
        <div className={styles.brushStrokeContainer}>
          <div className={styles.brushStroke}></div>
          <div className={styles.brushStroke}></div>
          <div className={styles.brushStroke}></div>
        </div>
      </div>
      
      {/* TikTok Section - Using HTML5 video player with improved styling */}
      <section className={styles.tiktokSection}>
        
        
        <div className={styles.tiktokGrid}>
          {loadingVideos ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
              <p>Loading videos...</p>
            </div>
          ) : (
            tiktokVideos.map(video => (
              <div key={video.id} className={styles.tiktokCard}>
                <div className={styles.tiktokWrapper}>
                  <video 
                    src={video.videoSrc}
                    poster={video.thumbnail}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className={styles.videoPlayer}
                    title={video.title || `Video ${video.id}`}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </section>
      
      {showScroll && <ScrollToTop />}
    </div>
  );
}

export default Home;
