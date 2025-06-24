import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import api from "../api/axios";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const maxWords = 200;

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "message") {
      const words = value.trim() ? value.trim().split(/\s+/) : [];
      const currentWordCount = words.length;
      
      if (currentWordCount <= maxWords || value.length < formData.message.length) {
        setWordCount(currentWordCount);
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check word count before submitting
    if (wordCount > maxWords) {
      setSubmitStatus({ 
        success: false, 
        message: `Message exceeds ${maxWords} words limit` 
      });
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await api.post('/api/contact', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      setSubmitStatus({ 
        success: true, 
        message: response.data.message || 'Message sent successfully!' 
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
      setWordCount(0);
    } catch (error) {
      console.error('Error submitting form:', error);
      let errorMessage = 'Failed to send message. Please try again.';
      
      if (error.response) {
        if (error.response.data.errors) {
          errorMessage = Object.values(error.response.data.errors).join(' ');
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      }
      
      setSubmitStatus({ 
        success: false, 
        message: errorMessage 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero
       <div
        className="position-relative mb-5"
        style={{
          height: "60vh",
          background: "linear-gradient(135deg, rgba(134,184,23,0.8) 0%, rgba(0,0,0,0.7) 100%), url('../assets/img/contact-us.jpg') center/cover no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "0 0 2rem 2rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
        }}
      >
        <motion.div
          className="text-center text-white px-3"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          data-aos="fade-up"
        >
          <h1 className="display-3 fw-bold mb-4" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>Get In Touch</h1>
          <p className="lead fs-4 mb-4" data-aos="fade-up" data-aos-delay="200" style={{ fontWeight: 300 }}>
            We'd love to hear from you and help plan your next adventure
          </p>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-aos="fade-up" 
            data-aos-delay="300"
          >
            <Link 
              to="#contact-form" 
              className="btn btn-light btn-lg rounded-pill px-4 py-2"
              style={{ fontWeight: 500 }}
            >
              Send a Message
            </Link>
          </motion.div>
        </motion.div>
      </div>
       Header */}
     

      {/* Modern Contact Cards Section */}
      <div className="container-xxl py-5">
        <div className="container">
          {/* Section Header */}
          <div className="text-center mb-5" data-aos="fade-up">
            <h6 className="section-title bg-white text-center text-primary px-3 mb-3">
              How to Reach Us
            </h6>
            <h1 className="display-5 fw-bold mb-4">Contact Information</h1>
            <div
              className="mx-auto"
              style={{
                maxWidth: "700px",
                height: "4px",
                background: "linear-gradient(to right, #86B817, transparent)",
                opacity: 0.5,
              }}
            ></div>
          </div>

          {/* Contact Cards - Modern Layout */}
          <div className="row g-4 justify-content-center">
            {/* Contact Info Card */}
            <div className="col-lg-4 col-md-6" data-aos="fade-right">
              <motion.div
                className="card border-0 h-100"
                whileHover={{ y: -5 }}
                style={{
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  borderRadius: "1rem",
                  overflow: "hidden",
                  borderTop: "4px solid #86B817",
                }}
              >
                <div className="card-body p-4 text-center">
                  <div
                    className="icon-box bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                    style={{ width: 70, height: 70 }}
                  >
                    <i className="fas fa-map-marker-alt fs-4"></i>
                  </div>
                  <h5 className="card-title mb-3">Our Location</h5>
                  <p className="text-muted mb-0">Mansourah, Tlemcen, Algeria</p>
                   <a
                    href="https://maps.app.goo.gl/UgG6F1231u6Wqtm96"
                    className="btn btn-sm btn-outline-primary mt-3"
                  >
                    Check it on Maps
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Phone Card */}
            <div className="col-lg-4 col-md-6" data-aos="fade-up">
              <motion.div
                className="card border-0 h-100"
                whileHover={{ y: -5 }}
                style={{
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  borderRadius: "1rem",
                  overflow: "hidden",
                  borderTop: "4px solid #86B817",
                }}
              >
                <div className="card-body p-4 text-center">
                  <div
                    className="icon-box bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                    style={{ width: 70, height: 70 }}
                  >
                    <i className="fas fa-phone-alt fs-4"></i>
                  </div>
                  <h5 className="card-title mb-3">Phone Number</h5>
                  <p className="text-muted mb-0">+213 554 301 727</p>
                  <a
                    href="tel:+213554301727"
                    className="btn btn-sm btn-outline-primary mt-3"
                  >
                    Call Now
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Email Card */}
            <div className="col-lg-4 col-md-6" data-aos="fade-left">
              <motion.div
                className="card border-0 h-100"
                whileHover={{ y: -5 }}
                style={{
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  borderRadius: "1rem",
                  overflow: "hidden",
                  borderTop: "4px solid #86B817",
                }}
              >
                <div className="card-body p-4 text-center">
                  <div
                    className="icon-box bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                    style={{ width: 70, height: 70 }}
                  >
                    <i className="fas fa-envelope fs-4"></i>
                  </div>
                  <h5 className="card-title mb-3">Email Address</h5>
                  <p className="text-muted mb-0">info@RihlaDZ.com</p>
                  <a
                    href="mailto:info@RihlaDZ.com"
                    className="btn btn-sm btn-outline-primary mt-3"
                  >
                    Email Us
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Form Section */}
      <div className="bg-light py-5 position-relative" style={{ overflow: "hidden" }}>
        {/* Decorative Elements */}
        <div style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(134,184,23,0.1)",
          zIndex: 0
        }}></div>
        <div style={{
          position: "absolute",
          bottom: "-100px",
          left: "-100px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "rgba(134,184,23,0.1)",
          zIndex: 0
        }}></div>
        
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card border-0 shadow-sm" 
                style={{ 
                  borderRadius: "1.5rem",
                  overflow: "hidden"
                }}
                data-aos="fade-up"
              >
                <div className="row g-0">
                  {/* Form Side */}
                  <div className="col-md-6 p-5" id="contact-form">
                    <h2 className="fw-bold mb-4">Send Us a Message</h2>
                    {submitStatus && (
                      <div className={`alert alert-${submitStatus.success ? 'success' : 'danger'} mb-4`}>
                        {submitStatus.message}
                      </div>
                    )}
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label text-muted small">Full Name *</label>
                        <input
                          type="text"
                          className="form-control py-3 px-3"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          style={{ borderRadius: "0.75rem", border: "1px solid #dee2e6" }}
                          required
                        />
                      </div>
                      
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="email" className="form-label text-muted small">Email *</label>
                          <input
                            type="email"
                            className="form-control py-3 px-3"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            style={{ borderRadius: "0.75rem", border: "1px solid #dee2e6" }}
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="phone" className="form-label text-muted small">Phone</label>
                          <input
                            type="tel"
                            className="form-control py-3 px-3"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+213 XXX XXX XXX"
                            style={{ borderRadius: "0.75rem", border: "1px solid #dee2e6" }}
                          />
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="subject" className="form-label text-muted small">Subject</label>
                        <input
                          type="text"
                          className="form-control py-3 px-3"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="What's this about?"
                          style={{ borderRadius: "0.75rem", border: "1px solid #dee2e6" }}
                        />
                      </div>
                      
                      <div className="mb-4 position-relative">
                        <label htmlFor="message" className="form-label text-muted small">Your Message *</label>
                        <textarea
                          className="form-control py-3 px-3"
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows="4"
                          placeholder="Write your message here..."
                          style={{ borderRadius: "0.75rem", border: "1px solid #dee2e6" }}
                          required
                        ></textarea>
                        <div 
                          className={`position-absolute bottom-0 end-0 me-3 mb-2 small ${
                            wordCount > maxWords ? 'text-danger' : 'text-muted'
                          }`}
                        >
                          {wordCount}/{maxWords}
                        </div>
                      </div>
                      
                      <motion.button
                        className="btn btn-primary w-100 py-3 fw-bold border-0"
                        type="submit"
                        disabled={isSubmitting || wordCount > maxWords}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ 
                          borderRadius: "0.75rem",
                          background: "linear-gradient(to right, #86B817, #6a9a12)",
                          opacity: isSubmitting || wordCount > maxWords ? 0.7 : 1
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Sending...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-paper-plane me-2"></i> Send Message
                          </>
                        )}
                      </motion.button>
                    </form>
                  </div>
                  
                  {/* Map Side */}
                  <div className="col-md-6 d-none d-md-flex p-0" style={{ background: "#f8f9fa" }}>
                    <div className="h-100 d-flex flex-column">
                      <div className="flex-grow-1">
                        <div className="h-100 w-100">
                          <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23154.728579020237!2d-1.3641158341639017!3d34.89279723747474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd78c86360eebd11%3A0x439fe45c38348df0!2sAbou%20Bekr%20Belkaid%20University!5e1!3m2!1sen!2sdz!4v1745759912572!5m2!1sen!2sdz"
                            style={{ border: "none", height: "100%", width: "100%" }}
                            allowFullScreen
                            loading="lazy"
                          ></iframe>
                        </div>
                      </div>
                      
                      {/* Contact Info at bottom of map */}
                      <div className="p-4" style={{ background: "white", borderTop: "1px solid #dee2e6" }}>
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-map-marker-alt text-primary me-3"></i>
                          <span>Abou Bekr Belkaid University, Tlemcen, Algeria</span>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-phone-alt text-primary me-3"></i>
                          <span>+213 554 301 727</span>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-envelope text-primary me-3"></i>
                          <span>rihladz@info.dz</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <i className="fas fa-clock text-primary me-3"></i>
                          <span>Sun-Fri: 8AM - 5PM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Contact Section */}
      <div className="py-5">
        <div className="container text-center" data-aos="fade-up">
          <h3 className="mb-4">Connect With Us</h3>
          <p className="text-muted mb-4">
            Follow us on social media for updates and special offers
          </p>
          <div className="d-flex justify-content-center flex-wrap gap-3">
            <motion.a
              href="#"
              className="social-icon d-flex align-items-center justify-content-center"
              whileHover={{
                y: -3,
                boxShadow: "0 5px 15px rgba(134,184,23,0.3)",
              }}
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: "#86B817",
                color: "white",
                fontSize: "1.2rem",
              }}
            >
              <i className="fab fa-facebook-f"></i>
            </motion.a>
            <motion.a
              href="#"
              className="social-icon d-flex align-items-center justify-content-center"
              whileHover={{
                y: -3,
                boxShadow: "0 5px 15px rgba(134,184,23,0.3)",
              }}
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: "#86B817",
                color: "white",
                fontSize: "1.2rem",
              }}
            >
              <i className="fab fa-instagram"></i>
            </motion.a>
            <motion.a
              href="https://wa.me/213554301727"
              className="social-icon d-flex align-items-center justify-content-center"
              whileHover={{
                y: -3,
                boxShadow: "0 5px 15px rgba(134,184,23,0.3)",
              }}
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: "#86B817",
                color: "white",
                fontSize: "1.2rem",
              }}
            >
              <i className="fab fa-whatsapp"></i>
            </motion.a>
            <motion.a
              href="#"
              className="social-icon d-flex align-items-center justify-content-center"
              whileHover={{
                y: -3,
                boxShadow: "0 5px 15px rgba(134,184,23,0.3)",
              }}
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: "#86B817",
                color: "white",
                fontSize: "1.2rem",
              }}
            >
              <i className="fab fa-twitter"></i>
            </motion.a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;