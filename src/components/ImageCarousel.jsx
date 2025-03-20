import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from '../css/ImageCarousel.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const ImageCarousel = () => {
  // Dynamically import all images from the assets/images folder
  const importAll = (r) => r.keys().map(r);
  const images = importAll(
    require.context('../assets/images', false, /\.(webp|png|jpg|jpeg|gif)$/)
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Determine how many slides to show based on window width
  const getSlidesToShow = () => {
    if (windowWidth <= 768) return 1;
    if (windowWidth <= 1024) return 2;
    return 3;
  };
  
  const [slidesToShow, setSlidesToShow] = useState(getSlidesToShow());

  // Update slides to show when window is resized
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setSlidesToShow(getSlidesToShow());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [windowWidth]);

  const nextSlide = () => {
    setCurrentIndex(prevIndex => {
      // Calculate next index, ensuring we don't go past the end
      const nextIndex = prevIndex + slidesToShow;
      // If next index would go past the end, go to the beginning or the last possible starting index
      return nextIndex >= images.length ? Math.max(0, images.length - slidesToShow) : nextIndex;
    });
  };

  const prevSlide = () => {
    setCurrentIndex(prevIndex => {
      // Calculate previous index, ensuring we don't go below 0
      const prevIdx = prevIndex - slidesToShow;
      return prevIdx < 0 ? 0 : prevIdx;
    });
  };

  // Determine if next/prev buttons should be disabled
  const isNextDisabled = currentIndex >= images.length - slidesToShow;
  const isPrevDisabled = currentIndex === 0;

  // Handle dot indicator click
  const goToSlide = (index) => {
    // Make sure we don't go beyond the last possible starting index
    const maxStartingIndex = Math.max(0, images.length - slidesToShow);
    setCurrentIndex(Math.min(index, maxStartingIndex));
  };

  // Generate visible slides
  const visibleSlides = images.slice(currentIndex, currentIndex + slidesToShow);

  // Generate dot indicators (one for each possible starting position)
  const totalDots = Math.ceil(Math.max(1, images.length - slidesToShow + 1));
  const dots = Array.from({ length: totalDots }, (_, i) => i);

  return (
    <div className={styles.carouselContainer}>
      <h2 className={styles.sectionTitle}>My works</h2>
      
      <div className={styles.carousel}>
        <button 
          className={`${styles.carouselButton} ${styles.prevButton} ${isPrevDisabled ? styles.disabled : ''}`} 
          onClick={prevSlide}
          disabled={isPrevDisabled}
          aria-label="Previous images"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        
        <div className={styles.carouselContent}>
          <div className={styles.slideTrack} style={{ 
            transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
            gridTemplateColumns: `repeat(${images.length}, calc(${100 / slidesToShow}% - 16px))`
          }}>
            {images.map((image, index) => (
              <div 
                key={index} 
                className={styles.slideItem}
              >
                <img 
                  src={image} 
                  alt={`Artwork ${index + 1}`} 
                  className={styles.carouselImage}
                  draggable="false"
                />
              </div>
            ))}
          </div>
          
          <div className={styles.indicators}>
            {dots.map((dotIndex) => (
              <button
                key={dotIndex}
                className={`${styles.indicator} ${currentIndex === dotIndex ? styles.active : ''}`}
                onClick={() => goToSlide(dotIndex)}
                aria-label={`Go to image group ${dotIndex + 1}`}
              />
            ))}
          </div>
        </div>
        
        <button 
          className={`${styles.carouselButton} ${styles.nextButton} ${isNextDisabled ? styles.disabled : ''}`} 
          onClick={nextSlide}
          disabled={isNextDisabled}
          aria-label="Next images"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
};

export default ImageCarousel;