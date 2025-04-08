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
  const [previewImage, setPreviewImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
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
    const file = e.target.files[0];
    if (file) {
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!painting.title || !imageBase64) {
      setMessage({ type: 'error', text: 'Please provide a title and image' });
      return;
    }

    try {
      setIsUploading(true);
      setMessage(null);
      
      const response = await fetch('/.netlify/functions/upload-painting', {
        method: 'POST',
        body: JSON.stringify({
          ...painting,
          imageBase64
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
      setPreviewImage(null);
      setImageBase64(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      setMessage({ type: 'success', text: 'Painting uploaded successfully!' });
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: error.message });
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
            <label>Image File:</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              ref={fileInputRef}
              className={styles.fileInput}
              required
            />
            {previewImage && (
              <div className={styles.previewContainer}>
                <img src={previewImage} alt="Preview" className={styles.preview} />
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