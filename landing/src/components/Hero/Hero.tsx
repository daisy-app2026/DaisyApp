import { motion } from 'framer-motion';
import { LINKS } from '../../constants';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Hero.module.css';

interface HeroProps {
  showVideo?: boolean;
}

export default function Hero({ showVideo = true }: HeroProps) {
  const { t } = useLanguage();

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
            <path d="M12 2C8 2 5 5 5 9c0 3.5 2.5 6.5 6 7.4V22h2v-5.6c3.5-.9 6-3.9 6-7.4 0-4-3-7-7-7z" fill="currentColor" />
          </svg>
          {t('hero.badge')}
        </motion.div>

        {/* 2. Main Title (Two lines!) */}
        <motion.h1 className={styles.heroTitle} variants={childVariants}>
          <span className={styles.line1}>{t('hero.titleLine1')}</span>
          <span className={styles.line2}>{t('hero.titleLine2')}</span>
        </motion.h1>

        {/* 3. VIDEO (embedded directly - only on landing page) */}
        {showVideo && (
          <motion.div className={styles.videoWrapper} variants={childVariants}>
            <div className={styles.videoGlow}></div>
            <div className={styles.videoContainer}>
              {LINKS.demoVideo ? (
                <iframe
                  src={LINKS.demoVideo}
                  className={styles.videoIframe}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                  title={t('hero.watchDemo')}
                />
              ) : (
                <div className={styles.videoPlaceholder}>
                  <button className={styles.playButton} aria-label="Play video demo">
                    <svg viewBox="0 0 24 24" className={styles.playIcon}>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                  <span className={styles.videoLabel}>{t('hero.watchDemoDesc')}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 4. Subtitle text BELOW video! */}
        <motion.p className={styles.heroSubtitle} variants={childVariants}>
          {t('hero.subtitle')}
        </motion.p>

        {/* 5. Download buttons (bottom) */}
        <motion.div className={styles.downloadButtons} variants={childVariants}>
          <a
            href={LINKS.appStore}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.storeBadgeWrapper}
          >
            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt={t('hero.downloadAppStore')}
              className={styles.appStoreBadge}
              loading="lazy"
              style={{ objectFit: 'cover' }}
            />
          </a>

          <a
            href={LINKS.playStore}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.storeBadgeWrapper}
          >
            <img
              src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
              alt={t('hero.getOnPlayStore')}
              className={styles.playStoreBadge}
              loading="lazy"
              style={{ objectFit: 'cover' }}
            />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}