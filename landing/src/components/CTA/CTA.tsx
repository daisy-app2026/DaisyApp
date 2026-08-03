import { motion } from 'framer-motion';
import { LINKS } from '../../constants';
import { useLanguage } from '../../context/LanguageContext';
import styles from './CTA.module.css';

export default function CTA() {
  const { t } = useLanguage();

  return (
    <section className={styles.cta} id="download">
      <motion.div 
        className={styles.ctaCard}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.ctaGlow}></div>
        
        <h2 className={styles.ctaTitle}>{t('cta.title')}</h2>
        <p className={styles.ctaSubtitle}>
          {t('cta.subtitle')}
        </p>

        {/* CTA Store Badges */}
        <div className={styles.ctaButtons}>
          <a 
            href={LINKS.appStore} 
            onClick={(e) => {
              if (!LINKS.appStore || LINKS.appStore === '#') {
                e.preventDefault();
                alert(t('hero.appStoreComingSoon'));
              }
            }}
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
        </div>
      </motion.div>
    </section>
  );
}
