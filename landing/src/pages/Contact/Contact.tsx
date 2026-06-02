import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Contact.module.css';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message) {
      alert('Please fill out all required fields (Name, Email, and Message).');
      return;
    }

    const emailSubject = subject || 'Inquiry about Daisy App';
    const emailBody = `Hello Meriem,

My Name: ${name}
My Email: ${email}

Message details:
${message}

Best regards,
${name}`;

    // Construct prefilled mailto anchor URL
    const mailtoUrl = `mailto:mery.the.psychologist@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <motion.div 
      className={styles.contactPage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.contactCard}>
        <h1 className={styles.title}>Contact Us</h1>
        <p className={styles.subtitle}>Have a question, feedback, or need help? We'd love to hear from you!</p>

        {/* Info Grid */}
        <div className={styles.infoBlock}>
          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px' }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div className={styles.infoText}>
              <strong>Email:</strong> <a href="mailto:mery.the.psychologist@gmail.com">mery.the.psychologist@gmail.com</a>
            </div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px' }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div className={styles.infoText}>
              <strong>Location:</strong> Germany
            </div>
          </div>
        </div>

        {/* Dynamic Static Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="contact-name">Your Name *</label>
            <input 
              type="text" 
              id="contact-name"
              className={styles.input} 
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="contact-email">Email Address *</label>
            <input 
              type="email" 
              id="contact-email"
              className={styles.input} 
              placeholder="e.g. john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="contact-subject">Subject (Optional)</label>
            <input 
              type="text" 
              id="contact-subject"
              className={styles.input} 
              placeholder="e.g. Question about Daisy's AI journal features"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="contact-message">Message *</label>
            <textarea 
              id="contact-message"
              className={`${styles.input} ${styles.textarea}`} 
              placeholder="Write your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>

          <button type="submit" className={styles.submitBtn}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.submitIcon}>
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            Send Message
          </button>
        </form>
      </div>

      {/* Social networks redirects */}
      <div className={styles.socialContainer}>
        <span className={styles.socialTitle}>Find Meriem Tafsi on Social Media</span>
        <div className={styles.socialLinks}>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.socialIcon}>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
            Instagram
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialBtn}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.socialIcon}>
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
            LinkedIn
          </a>
        </div>
      </div>
    </motion.div>
  );
}
