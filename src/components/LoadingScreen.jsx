import React from "react";
import styles from "../css/LoadingScreen.module.css";

const LoadingScreen = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingContent}>
        <div className={styles.palette}>
          <div className={styles.paletteHole}></div>
          <div className={styles.colorSpot} style={{ backgroundColor: "#ebaaaf" }}></div>
          <div className={styles.colorSpot} style={{ backgroundColor: "#556477" }}></div>
          <div className={styles.colorSpot} style={{ backgroundColor: "#efeae1" }}></div>
        </div>
        <div className={styles.loadingText}>
          <h2>Loading Marta's Gallery</h2>
          <div className={styles.dots}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <p className={styles.quote}>"Art is never finished, only abandoned."</p>
      </div>
    </div>
  );
};

export default LoadingScreen;