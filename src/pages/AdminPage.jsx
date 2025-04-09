import React, { useState, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../css/AdminPage.module.css";

function AdminPage() {
  const [painting, setPainting] = useState({
    title: "",
    description: "",
    year: new Date().getFullYear().toString(),
    adminPassword: ""
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [imagesBase64, setImagesBase64] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPainting({
      ...painting,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Process each file
    const newPreviewImages = [];
    const newImagesBase64 = [];
    
    const processFile = (file, index) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviewImages[index] = reader.result;
          newImagesBase64[index] = reader.result;
          resolve();
        };
        reader.readAsDataURL(file);
      });
    };

    // Process all files in parallel
    Promise.all(files.map((file, index) => processFile(file, index)))
      .then(() => {
        setPreviewImages(newPreviewImages);
        setImagesBase64(newImagesBase64);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!painting.title || imagesBase64.length === 0) {
      setMessage({ type: 'error', text: 'Please provide a title and at least one image' });
      return;
    }

    try {
      setIsUploading(true);
      setMessage(null);
      
      const response = await fetch('/.netlify/functions/upload-painting', {
        method: 'POST',
        body: JSON.stringify({
          ...painting,
          images: imagesBase64
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload painting');
      }
      
      // Reset form
      setPainting({
        title: "",
        description: "",
        year: new Date().getFullYear().toString(),
        adminPassword: painting.adminPassword
      });
      setPreviewImages([]);
      setImagesBase64([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      setMessage({ type: 'success', text: 'Painting uploaded successfully!' });
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: error.message || 'An unknown error occurred' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.adminContainer}>
      <Header />
      <div className={styles.adminContent}>
        <h1>Admin Panel</h1>
        <p className={styles.instructions}>
          Upload new paintings to your gallery. They will be automatically displayed on your site.
        </p>
        
        {message && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.uploadForm}>
          <div className={styles.formGroup}>
            <label>Image Files (first image will be the main thumbnail):</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              ref={fileInputRef}
              className={styles.fileInput}
              multiple
              required
            />
            {previewImages.length > 0 && (
              <div className={styles.previewsContainer}>
                {previewImages.map((preview, index) => (
                  <div key={index} className={styles.previewContainer}>
                    <img src={preview} alt={`Preview ${index + 1}`} className={styles.preview} />
                    {index === 0 && <span className={styles.primaryBadge}>Primary</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label>Title:</label>
            <input 
              type="text" 
              name="title" 
              value={painting.title} 
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Year:</label>
            <input 
              type="text" 
              name="year" 
              value={painting.year} 
              onChange={handleInputChange}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Description:</label>
            <textarea 
              name="description" 
              value={painting.description} 
              onChange={handleInputChange}
              rows="4"
            ></textarea>
          </div>
          
          <div className={styles.formGroup}>
            <label>Admin Password:</label>
            <input 
              type="password" 
              name="adminPassword" 
              value={painting.adminPassword} 
              onChange={handleInputChange}
              required
            />
          </div>
          
          <button 
            type="submit"
            className={styles.uploadButton}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload Painting'}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default AdminPage;