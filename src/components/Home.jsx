import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import data from "../Data";
import styles from "../css/Home.module.css";

// Import profile image
import profileImage from "../assets/profile/profile.jpeg"; // Update this path if needed

// You'll need to add these images to your project
import framedPortrait from "../assets/HomePaintings/portrait.png"; 
import framedBust from "../assets/HomePaintings/FireWater.png";
import framedFlowers from "../assets/HomePaintings/flowers.png";
import portrait2 from "../assets/images/face2.jpeg";
import sunset from "../assets/images/Landscape.jpeg";
import rose from "../assets/images/roses.jpeg";

function Home() {
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
      
      {/* Works Section */}
      <section className={styles.worksSection}>
        <h2 className={styles.sectionTitle}>My works →</h2>
        <div className={styles.worksGrid}>
          <div className={styles.workItem}>
            <img src={portrait2} alt="Portrait artwork" />
          </div>
          <div className={styles.workItem}>
            <img src={sunset} alt="Sunset painting" />
          </div>
          <div className={styles.workItem}>
            <img src={rose} alt="Rose painting" />
          </div>
        </div>
      </section>
      
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
      
      {showScroll && <ScrollToTop />}
    </div>
  );
}

export default Home;
