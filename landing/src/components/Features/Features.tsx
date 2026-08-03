import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LINKS } from '../../constants';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Features.module.css';

export default function Features() {
  const [activeTab, setActiveTab] = useState(0);
  const { t } = useLanguage();

  const tabsData = [
    {
      id: 'diary',
      tabLabel: t('features.tabs.diary'),
      tag: t('features.diary.tag'),
      title: t('features.diary.title'),
      description: t('features.diary.description'),
      image: LINKS.diaryScreenshot,
      steps: t('features.diary.steps') as string[],
    },
    {
      id: 'past',
      tabLabel: t('features.tabs.past'),
      tag: t('features.past.tag'),
      title: t('features.past.title'),
      description: t('features.past.description'),
      image: LINKS.talkToPastScreenshot,
      steps: t('features.past.steps') as string[],
    },
    {
      id: 'crush',
      tabLabel: t('features.tabs.crush'),
      tag: t('features.crush.tag'),
      title: t('features.crush.title'),
      description: t('features.crush.description'),
      image: LINKS.talkToCrushScreenshot,
      steps: t('features.crush.steps') as string[],
    },
  ];

  // Preload all screenshot images as soon as component mounts for instant tab switching
  useEffect(() => {
    tabsData.forEach((tab) => {
      if (tab.image) {
        const img = new Image();
        img.src = tab.image;
      }
    });
  }, []);

  const currentTab = tabsData[activeTab];

  // Motion animation presets
  const tabContentVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4, ease: 'easeOut' as const }
    },
    exit: { 
      opacity: 0, 
      x: -30,
      transition: { duration: 0.2, ease: 'easeIn' as const }
    }
  };

  const stepsVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const stepItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 100 } }
  };

  return (
    <section className={styles.features} id="features">
      <div className={styles.sectionLabel}>{t('features.sectionLabel')}</div>
      <h2 className={styles.sectionTitle}>{t('features.sectionTitle')}</h2>

      {/* Tab Selector Buttons */}
      <div className={styles.tabContainer}>
        {tabsData.map((tab, idx) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === idx ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(idx)}
          >
            {tab.tabLabel}
          </button>
        ))}
      </div>

      {/* Tab Content Display */}
      <div className={styles.contentWrapper}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className={styles.featureContent}
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Phone Mockup Frame (3D Glass) */}
            <div className={styles.phoneMockup}>
              {currentTab.image ? (
                <img 
                  src={currentTab.image} 
                  alt={`${currentTab.title} Interface mockup`} 
                  className={styles.screenshotImg} 
                  loading="eager"
                  decoding="async"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div className={styles.screenshotPlaceholder}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.placeholderIcon}>
                    <rect x="5" y="2" width="14" height="20" rx="2"/>
                    <circle cx="12" cy="18" r="1"/>
                  </svg>
                  <span className={styles.placeholderText}>Screenshot demonstration coming soon</span>
                </div>
              )}
            </div>

            {/* Feature details column */}
            <div className={styles.featureInfo}>
              <span className={styles.featureTag}>{currentTab.tag}</span>
              <h3 className={styles.featureTitle}>{currentTab.title}</h3>
              <p className={styles.featureDesc}>{currentTab.description}</p>

              {/* Numbered Steps list with staggered scroll animations */}
              <motion.ul 
                className={styles.stepsList}
                variants={stepsVariants}
                initial="hidden"
                animate="visible"
              >
                {Array.isArray(currentTab.steps) && currentTab.steps.map((step, sIdx) => (
                  <motion.li 
                    key={sIdx} 
                    className={styles.step}
                    variants={stepItemVariants}
                  >
                    <div className={styles.stepNum}>{sIdx + 1}</div>
                    <span className={styles.stepText}>{step}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Hidden image preloader to keep all tab screenshots in browser cache */}
      <div style={{ display: 'none' }} aria-hidden="true">
        {tabsData.map((t) => t.image && (
          <img key={t.id} src={t.image} alt="" loading="eager" />
        ))}
      </div>
    </section>
  );
}
