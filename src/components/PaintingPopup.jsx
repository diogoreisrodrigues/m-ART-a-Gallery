import React, { useState, useEffect } from "react";
import styles from "../css/PaintingPopup.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const PaintingPopup = ({ painting, onClose, onInterest }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [paintingDetails, setPaintingDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (painting && painting.id) {
      // Fetch detailed painting info with all images
      const fetchPaintingDetails = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/.netlify/functions/get-painting-details?id=${painting.id}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch painting details');
          }
          
          const data = await response.json();
          console.log('Painting details:', data); // Debug log
          setPaintingDetails(data);
        } catch (error) {
          console.error('Error fetching painting details:', error);
          // Fall back to the painting data we already have
          setPaintingDetails(painting);
        } finally {
          setLoading(false);
        }
      };
      
      fetchPaintingDetails();
    } else {
      // If we don't have an ID (local data), just use what we have
      setPaintingDetails(painting);
      setLoading(false);
    }
  }, [painting]);

  if (!painting) return null;
  
  // Use the detailed painting data if available, otherwise use the passed painting
  const displayPainting = paintingDetails || painting;
  
  // Get the images array, or create one with the single image if we're using old data
  let images = [];
  
  if (displayPainting.images && Array.isArray(displayPainting.images)) {
    // If we have an images array from the API
    images = displayPainting.images;
  } else if (displayPainting.image_url) {
    // If we have a single image URL
    images = [{ image_url: displayPainting.image_url }];
  } else if (displayPainting.path) {
    // If we're using local data with a path
    const imagePath = require(`../assets/images/${displayPainting.path}`);
    images = [{ image_url: imagePath }];
  }
  
  // Debug log
  console.log('Images array:', images);
  console.log('Current image index:', currentImageIndex);
  
  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  };
  
  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    }
  };

  // Make sure we have a valid current image index
  const safeImageIndex = Math.min(currentImageIndex, images.length - 1);
  const currentImage = images[safeImageIndex] || {};

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        
        <div className={styles.content}>
          <div className={styles.imageContainer}>
            {loading ? (
              <div className={styles.loadingIndicator}>Loading...</div>
            ) : images.length === 0 ? (
              <div className={styles.loadingIndicator}>No images available</div>
            ) : (
              <>
                <img 
                  src={currentImage.image_url} 
                  alt={displayPainting.title} 
                  className={styles.image}
                />
                
                {images.length > 1 && (
                  <div className={styles.imageNavigation}>
                    <button 
                      className={`${styles.navButton} ${styles.prevButton}`}
                      onClick={prevImage}
                      aria-label="Previous image"
                    >
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    
                    <div className={styles.imageDots}>
                      {images.map((_, index) => (
                        <button
                          key={index}
                          className={`${styles.imageDot} ${index === safeImageIndex ? styles.activeDot : ''}`}
                          onClick={() => setCurrentImageIndex(index)}
                          aria-label={`View image ${index + 1}`}
                        />
                      ))}
                    </div>
                    
                    <button 
                      className={`${styles.navButton} ${styles.nextButton}`}
                      onClick={nextImage}
                      aria-label="Next image"
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className={styles.details}>
            <h2 className={styles.title}>{displayPainting.title}</h2>
            <p className={styles.year}>{displayPainting.year}</p>
            <p className={styles.description}>{displayPainting.description}</p>
            <button 
              className={styles.interestButton}
              onClick={() => onInterest(displayPainting)}
            >
              I'm Interested
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaintingPopup;