import React, { useState } from 'react';
import './Contact.css';
import { saveContactForm } from '../firebaseConfig';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState("");

  const handleInputChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};


  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitResult("Sending message...");

  // Validate form
  if (!formData.name || !formData.email || !formData.message) {
    setSubmitResult("Please fill in all required fields.");
    setIsSubmitting(false);
    return;
  }

  try {
    console.log("📝 Submitting form:", formData);

    // Save data to Firebase
    const firebaseResult = await saveContactForm(formData);

    if (!firebaseResult.success) {
      throw new Error(firebaseResult.error || "Failed to save to Firebase");
    }

    console.log("✅ Data saved to Firebase");

    // Send email using Render backend
    const response = await fetch(
      "https://the-project-smile.onrender.com/send-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    const emailResult = await response.json();

    if (!response.ok || !emailResult.success) {
      throw new Error(emailResult.message || "Email sending failed");
    }

    setSubmitResult("✅ Message sent successfully! We will get back to you soon.");

    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });

  } catch (error) {
    console.error(error);
    setSubmitResult("❌ Failed to send message. Please try again.");
  }

  setIsSubmitting(false);
};
  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1>Get In Touch</h1>
          <p>Connect with us to learn more about our work or get involved</p>
        </div>

        <div className="contact-content">
          <div className="contact-form-section">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number (Optional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Phone Number (Optional)"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="5"
                  required
                ></textarea>
              </div>

              <button type="submit" className="send-message-btn" disabled={isSubmitting}>
                <span>{isSubmitting ? '⏳' : '✈'}</span> 
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
              
              {submitResult && (
                <div className={`submit-result ${submitResult.includes('✅') ? 'success' : 'error'}`}>
                  {submitResult}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Interactive Map Section */}
        <div className="map-section">
          <div className="map-header">
            <h2>Find Us Here</h2>
            <p>Visit us at our location in Kishanganj, Bihar</p>
          </div>
          
          <div className="map-container">
            <div className="map-overlay">
              <div className="map-info">
                <h3>📍 Our Location</h3>
                <p>VILL- DALUA HAT, P.O-TAIYABPUR, P.S-ROTHIA, Distt.- KISHANGANJ, PIN-855117 (BIHAR)</p>
                <button className="directions-btn" onClick={() => window.open('https://maps.google.com/?q=DALUA+HAT,+TAIYABPUR,+KISHANGANJ,+BIHAR,+855117', '_blank')}>
                  <span>🧭</span> Get Directions
                </button>
              </div>
            </div>
            
            <div className="map-frame">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114346.75084631098!2d87.84309087343751!3d26.107978999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e58b1c9131b715%3A0x1f6d9b6b1f9e2b3c!2sKishanganj%2C%20Bihar!5e0!3m2!1sen!2sin!4v1699634400000!5m2!1sen!2sin"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="The Project Smile Location - Kishanganj, Bihar"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;