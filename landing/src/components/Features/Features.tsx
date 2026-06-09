import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LINKS } from '../../constants';
import styles from './Features.module.css'; // Pure CSS Module styling

interface TabData {
  id: string;
  tag: string;
  title: string;
  description: string;
  image: string;
  steps: string[];
}

export default function Features() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs: TabData[] = [
    {
      id: 'diary',
      tag: 'Personal Space',
      title: 'Your Personal Diary',
      description: 'Express yourself freely in 5 themed spaces. Write, record audio, capture images, or doodle your thoughts without judgment.',
      image: LINKS.diaryScreenshot,
      steps: [
        'Choose your space (Family, Bestie, Crush, Vent, or Imagine)',
        'Write, record, draw or capture assets',
        'Add a Memory Capsule to unlock later',
        'Search and filter your entries easily'
      ]
    },
    {
      id: 'past',
      tag: 'Emotional Healing',
      title: 'Talk to Your Past',
      description: 'Have healing conversations with people from your past. Process unresolved feelings and say what went unsaid with AI guidance.',
      image: LINKS.talkToPastScreenshot,
      steps: [
        'Tell us about the person',
        'Share how it ended',
        'Write what you never said',
        'Imagine your meeting',
        'Start your healing conversation'
      ]
    },
    {
      id: 'crush',
      tag: 'Relationship Advice',
      title: 'Talk to Your Crush',
      description: 'Get bestie-level advice about your crush. Practice conversations, decode confusing signals, and figure out your next move!',
      image: LINKS.talkToCrushScreenshot,
      steps: [
        'Tell us about your crush',
        'Share what you need help with',
        'Spill all the details',
        'Chat with your AI bestie!'
      ]
    }
  ];

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
      <div className={styles.sectionLabel}>Empathetic Core</div>
      <h2 className={styles.sectionTitle}>Designed For Your Mind</h2>

      {/* Tab Selector Buttons */}
      <div className={styles.tabContainer}>
        {tabs.map((tab, idx) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === idx ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(idx)}
          >
            {tab.id === 'diary' ? 'Diary' : tab.id === 'past' ? 'Talk to Past' : 'Talk to Crush'}
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
              {tabs[activeTab].image ? (
                <img 
                  src={tabs[activeTab].image} 
                  alt={`${tabs[activeTab].title} Interface mockup`} 
                  className={styles.screenshotImg} 
                  loading="lazy"
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
              <span className={styles.featureTag}>{tabs[activeTab].tag}</span>
              <h3 className={styles.featureTitle}>{tabs[activeTab].title}</h3>
              <p className={styles.featureDesc}>{tabs[activeTab].description}</p>

              {/* Numbered Steps list with staggered scroll animations */}
              <motion.ul 
                className={styles.stepsList}
                variants={stepsVariants}
                initial="hidden"
                animate="visible"
              >
                {tabs[activeTab].steps.map((step, sIdx) => (
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
    </section>
  );
}
