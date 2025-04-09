import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import styles from "../css/CommissionsPage.module.css";

function CommissionsPage() {
  const [showScroll, setShowScroll] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
    budget: "",
    timeline: "",
    reference: ""
  });
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Prepare email content
    const subject = `Commission Request from ${formData.name}`;
    const body = `
Name: ${formData.name}
Email: ${formData.email}
Description: ${formData.description}
Budget: ${formData.budget}
Timeline: ${formData.timeline}
Reference Images: ${formData.reference}
    `;
    
    // Open email client with pre-filled content
    window.location.href = `mailto:${encodeURIComponent("martavieira142004@gmail.com")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Show success message
    setMessage({ type: 'success', text: 'Your commission request has been prepared. Please send the email from your mail client.' });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      description: "",
      budget: "",
      timeline: "",
      reference: ""
    });
    
    setIsSubmitting(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className={styles.commissionsContainer}>
      <Header />
      
      
      
      <motion.div 
        className={styles.content}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className={styles.infoSection} variants={itemVariants}>
          <div className={styles.sectionIcon}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="#556477" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16Z" stroke="#556477" strokeWidth="2"/>
            </svg>
          </div>
          <h2>About Commissions</h2>
          <p>
            I'm delighted that you're interested in commissioning a custom artwork. 
            Each piece is created with care and attention to your specific requirements.
          </p>
          <p>
            Please fill out the form below with as much detail as possible to help me understand your vision.
            I'll get back to you within 2-3 business days to discuss your request further.
          </p>
        </motion.div>
        
        {message && (
          <motion.div 
            className={`${styles.message} ${styles[message.type]}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {message.text}
          </motion.div>
        )}
        
        <motion.form 
          onSubmit={handleSubmit} 
          className={styles.commissionForm}
          variants={itemVariants}
        >
          <div className={styles.formHeader}>
            <div className={styles.formIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 12V22H4V12" stroke="#556477" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 7H2V12H22V7Z" stroke="#556477" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22V7" stroke="#556477" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" stroke="#556477" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke="#556477" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2>Request Form</h2>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Your Name:</label>
              <input 
                type="text" 
                id="name"
                name="name" 
                value={formData.name} 
                onChange={handleInputChange}
                required
                className={styles.formInput}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address:</label>
              <input 
                type="email" 
                id="email"
                name="email" 
                value={formData.email} 
                onChange={handleInputChange}
                required
                className={styles.formInput}
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="description">Project Description:</label>
            <textarea 
              id="description"
              name="description" 
              value={formData.description} 
              onChange={handleInputChange}
              rows="4"
              placeholder="Please describe what you have in mind, including size, style, subject matter, etc."
              required
              className={styles.formTextarea}
            ></textarea>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="budget">Budget Range (€):</label>
              <input 
                type="text" 
                id="budget"
                name="budget" 
                value={formData.budget} 
                onChange={handleInputChange}
                placeholder="e.g., 200-300€"
                className={styles.formInput}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="timeline">Desired Timeline:</label>
              <input 
                type="text" 
                id="timeline"
                name="timeline" 
                value={formData.timeline} 
                onChange={handleInputChange}
                placeholder="e.g., Needed by September 15th"
                className={styles.formInput}
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="reference">Reference Images (URLs):</label>
            <textarea 
              id="reference"
              name="reference" 
              value={formData.reference} 
              onChange={handleInputChange}
              rows="2"
              placeholder="Please provide links to any reference images that might help explain your vision"
              className={styles.formTextarea}
            ></textarea>
          </div>
          
          <motion.button 
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Commission Request'}
          </motion.button>
        </motion.form>
        
        <motion.div className={styles.pricingInfo} variants={itemVariants}>
          <div className={styles.sectionIcon}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 1V23" stroke="#556477" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="#556477" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2>Pricing Information</h2>
          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <h3>Small Pieces</h3>
              <p className={styles.size}>up to 30x40cm</p>
              <p className={styles.price}>Starting at 150€</p>
            </div>
            <div className={styles.pricingCard}>
              <h3>Medium Pieces</h3>
              <p className={styles.size}>up to 60x80cm</p>
              <p className={styles.price}>Starting at 300€</p>
            </div>
            <div className={styles.pricingCard}>
              <h3>Large Pieces</h3>
              <p className={styles.size}>larger than 60x80cm</p>
              <p className={styles.price}>Starting at 500€</p>
            </div>
          </div>
          <div className={styles.pricingNote}>
            <p>
              A 30% non-refundable deposit is required to begin work, with the remaining balance due upon completion.
            </p>
          </div>
        </motion.div>
        
        <motion.div className={styles.processSection} variants={itemVariants}>
          <h2>The Commission Process</h2>
          <div className={styles.processSteps}>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>1</div>
              <h3>Inquiry</h3>
              <p>Submit your request with details about your vision</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>2</div>
              <h3>Consultation</h3>
              <p>We'll discuss your ideas, timeline, and budget</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>3</div>
              <h3>Creation</h3>
              <p>I'll create your artwork with regular updates</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>4</div>
              <h3>Delivery</h3>
              <p>Your finished artwork is carefully packaged and delivered</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      <Footer />
      {showScroll && <ScrollToTop />}
    </div>
  );
}

export default CommissionsPage;