import { motion } from 'framer-motion';
import { LINKS } from '../../constants';
import styles from './Hero.module.css';

export default function Hero() {
  // Stagger animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  // Individual element upward slide transitions
  const childVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring' as const, damping: 25, stiffness: 100 } 
    }
  };

  return (
    <section className={styles.hero}>
      <motion.div 
        className={styles.contentWrapper}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 1. Badge (top) */}
        <motion.div className={styles.badge} variants={childVariants}>
          <svg viewBox="0 0 24 24" fill="none" className={styles.badgeIcon}>
            <path d="M12 2C8 2 5 5 5 9c0 3.5 2.5 6.5 6 7.4V22h2v-5.6c3.5-.9 6-3.9 6-7.4 0-4-3-7-7-7z" fill="currentColor"/>
          </svg>
          By a Psychologist, For You
        </motion.div>

        {/* 2. Main Title (Two lines!) */}
        <motion.h1 className={styles.heroTitle} variants={childVariants}>
          <span className={styles.line1}>Your Safe Space to</span>
          <span className={styles.line2}>Heal, Reflect & Grow</span>
        </motion.h1>

        {/* 3. VIDEO (right after title!) */}
        {/* <motion.div className={styles.videoWrapper} variants={childVariants}>
          <div className={styles.videoGlow}></div>
          <div className={styles.videoContainer}>
  
            <div 
              className={styles.videoPlaceholder}
              onClick={() => {
                if (LINKS.demoVideo) {
                  window.open(LINKS.demoVideo, '_blank');
                } else {
                  alert('Watch How It Works video demonstration coming soon! (Meriem is working on uploading the video asset)');
                }
              }}
            >
              <button className={styles.playButton} aria-label="Play video demo">
                <svg viewBox="0 0 24 24" className={styles.playIcon}>
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
              <span className={styles.videoLabel}>Watch How It Works</span>
            </div>
          </div>
        </motion.div> */}

        {/* 4. Subtitle text BELOW video! */}
        <motion.p className={styles.heroSubtitle} variants={childVariants}>
          A psychologist-founded app for journaling, healing past connections, 
          and navigating your love life — all in one safe space.
        </motion.p>

        {/* 5. Download buttons (bottom) */}
        <motion.div className={styles.downloadButtons} variants={childVariants}>
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
        </motion.div>
      </motion.div>
    </section>
  );
}
