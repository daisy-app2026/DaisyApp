import { motion } from 'framer-motion';
import { LINKS } from '../../constants';
import styles from './About.module.css';

export default function About() {
  return (
    <section className={styles.about} id="about">
      <div className={styles.aboutInner}>
        {/* Left Column (Content) */}
        <motion.div 
          className={styles.aboutContent}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.founderTitle}>By a Psychologist, For You</span>
          <h2 className={styles.aboutTitle}>
            <span className={styles.line1}>Empathetic Design</span>
            <span className={styles.line2}>Rooted in Science</span>
          </h2>
          <p className={styles.aboutText}>
            Daisy was built from a deep understanding of psychological healing, emotional relationships, 
            and self-reflection patterns. We believe everyone deserves a modern, empathetic tool 
            to sort out their emotions and heal past wounds in complete safety.
          </p>
        </motion.div>

        {/* Right Column (Founder Glass Card) */}
        <motion.div 
          className={styles.founderCard}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
        >
          {LINKS.founderPhoto ? (
            <img 
              src={LINKS.founderPhoto} 
              alt="Meriem Tafsi, Psychologist & Founder of Daisy" 
              className={styles.founderPhoto} 
              loading="lazy"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className={styles.founderPhotoPlaceholder}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.founderIcon}>
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </div>
          )}
          
          <h3 className={styles.founderName}>Meriem Tafsi</h3>
          <p className={styles.founderTitle}>Psychologist & Founder</p>
          
          <p className={styles.founderQuote}>
            "As a psychologist, I created Daisy because everyone deserves a safe space 
            to express themselves, heal from the past, and navigate their emotions with confidence."
          </p>
        </motion.div>
      </div>
    </section>
  );
}
