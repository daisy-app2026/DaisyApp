import { motion } from 'framer-motion';
import { LINKS } from '../../constants';
import styles from './CTA.module.css';

export default function CTA() {
  return (
    <section className={styles.cta}>
      <motion.div 
        className={styles.ctaCard}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.ctaGlow}></div>
        
        <h2 className={styles.ctaTitle}>Start Your Healing Journey</h2>
        <p className={styles.ctaSubtitle}>
          Download Daisy today to sort your feelings, heal unresolved connections, 
          and practice conversations with confidence.
        </p>

        {/* CTA Store Badges */}
        <div className={styles.ctaButtons}>
          {/* TODO: Replace appStore link in constants.ts! */}
          <a 
            href={LINKS.appStore} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.storeBadgeWrapper}
          >
            <img 
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="Download on Apple App Store"
              className={styles.appStoreBadge}
              loading="lazy"
              style={{ objectFit: 'cover' }}
            />
          </a>
          
          {/* TODO: Replace playStore link in constants.ts! */}
          <a 
            href={LINKS.playStore} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.storeBadgeWrapper}
          >
            <img
              src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
              alt="Get it on Google Play Store"
              className={styles.playStoreBadge}
              loading="lazy"
              style={{ objectFit: 'cover' }}
            />
          </a>
          
          {/* TODO: Replace apkDownload link in constants.ts! */}
          <a href={LINKS.apkDownload} className={styles.apkBtn}>
            <svg viewBox="0 0 24 24" fill="currentColor" className={styles.apkIcon}>
              <path d="M12 16l-6-6h4V4h4v6h4l-6 6z"/>
              <path d="M20 20H4v-2h16v2z"/>
            </svg>
            Download APK
          </a>
        </div>
      </motion.div>
    </section>
  );
}
