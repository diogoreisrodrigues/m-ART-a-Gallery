import React from "react";
import styles from "../css/PaintingPopup.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const PaintingPopup = ({ painting, onClose, onInterest }) => {
  if (!painting) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        
        <div className={styles.content}>
          <div className={styles.imageContainer}>
            <img 
              src={painting.imageSource} 
              alt={painting.title} 
              className={styles.image}
            />
          </div>
          
          <div className={styles.details}>
            <h2 className={styles.title}>{painting.title}</h2>
            <p className={styles.year}>{painting.year}</p>
            <p className={styles.description}>{painting.description}</p>
            <button 
              className={styles.interestButton}
              onClick={() => onInterest(painting)}
            >
              I'm interested!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaintingPopup;