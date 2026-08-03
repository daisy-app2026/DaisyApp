import { motion } from 'framer-motion';
import { LINKS } from '../../constants';
import { useLanguage } from '../../context/LanguageContext';
import styles from './About.module.css';

export default function About() {
  const { t } = useLanguage();

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
          <span className={styles.founderTitle}>{t('about.sectionTitle')}</span>
          <h2 className={styles.aboutTitle}>
            <span className={styles.line1}>{t('about.line1')}</span>
            <span className={styles.line2}>{t('about.line2')}</span>
          </h2>
          <p className={styles.aboutText}>
            {t('about.description')}
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
          
          <h3 className={styles.founderName}>{t('about.founderName')}</h3>
          <p className={styles.founderTitle}>{t('about.founderTitle')}</p>
          
          <p className={styles.founderQuote}>
            {t('about.founderQuote')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
