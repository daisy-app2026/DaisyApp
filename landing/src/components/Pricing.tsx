import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import styles from './Pricing.module.css';

interface PlanFromBackend {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  originalYearlyPrice?: number;
  discountPercent?: number;
  chatLimit: number | string;
  messageLimit: number | string;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
}

interface PricingBackendResponse {
  plans?: {
    free?: PlanFromBackend;
    basic?: PlanFromBackend;
    pro?: PlanFromBackend;
  };
  free?: PlanFromBackend;
  basic?: PlanFromBackend;
  pro?: PlanFromBackend;
}

const DEFAULT_PLANS: Record<'free' | 'basic' | 'pro', PlanFromBackend> = {
  free: {
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    originalYearlyPrice: 0,
    discountPercent: 0,
    chatLimit: 3,
    messageLimit: 30,
    features: [
      'Unlimited diary journaling',
      '3 AI chats total',
      '30 messages total',
      'Memory capsule',
      '5 spaces',
    ],
    isPopular: false,
    isActive: true,
  },
  basic: {
    name: 'Basic',
    monthlyPrice: 8.99,
    yearlyPrice: 86.30,
    originalYearlyPrice: 107.88,
    discountPercent: 20,
    chatLimit: 10,
    messageLimit: 150,
    features: [
      'Unlimited diary journaling',
      '10 AI chats/month',
      '150 messages/month',
      'Audio entries',
      'Image entries',
      'Doodle entries',
    ],
    isPopular: true,
    isActive: true,
  },
  pro: {
    name: 'Pro',
    monthlyPrice: 14.99,
    yearlyPrice: 143.90,
    originalYearlyPrice: 179.88,
    discountPercent: 20,
    chatLimit: -1,
    messageLimit: 500,
    features: [
      'Unlimited diary journaling',
      'Unlimited AI chats',
      '500 messages/month',
      'Priority support',
      'Early access to features',
    ],
    isPopular: false,
    isActive: true,
  },
};

export default function Pricing() {
  const { t } = useLanguage();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [plans, setPlans] = useState<Record<'free' | 'basic' | 'pro', PlanFromBackend>>(DEFAULT_PLANS);

  useEffect(() => {
    fetchPublicPricing();
  }, []);

  const fetchPublicPricing = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/app/pricing`);
      if (res.ok) {
        const data: PricingBackendResponse = await res.json();
        const loadedPlans = data.plans || data;
        if (loadedPlans && loadedPlans.free) {
          setPlans({
            free: { ...DEFAULT_PLANS.free, ...loadedPlans.free },
            basic: { ...DEFAULT_PLANS.basic, ...loadedPlans.basic },
            pro: { ...DEFAULT_PLANS.pro, ...loadedPlans.pro },
          });
        }
      }
    } catch {
      // Fallback to DEFAULT_PLANS if server isn't reachable
    }
  };

  const handleCtaClick = (e: React.MouseEvent, planName: string) => {
    e.preventDefault();
    alert(`In-app purchases coming soon! ${planName} plan will be available directly inside the app.`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, damping: 25, stiffness: 100 },
    },
  };

  const freeData = plans.free;
  const basicData = plans.basic;
  const proData = plans.pro;

  // Basic monthly vs yearly price
  const basicMonthlyRate = (basicData.monthlyPrice || 8.99).toFixed(2);
  const basicYearlyMonthlyRate = (
    (basicData.yearlyPrice || 86.30) / 12
  ).toFixed(2);

  // Pro monthly vs yearly price
  const proMonthlyRate = (proData.monthlyPrice || 14.99).toFixed(2);
  const proYearlyMonthlyRate = (
    (proData.yearlyPrice || 143.90) / 12
  ).toFixed(2);

  return (
    <section id="pricing" className={styles.pricingSection}>
      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {/* Header */}
        <div className={styles.header}>
          <motion.div className={styles.badge} variants={cardVariants}>
            <Sparkles className={styles.badgeIcon} size={16} />
            <span>{t('pricing.title')}</span>
          </motion.div>
          <motion.h2 className={styles.title} variants={cardVariants}>
            {t('pricing.subtitle')}
          </motion.h2>

          {/* Billing Cycle Toggle */}
          <motion.div className={styles.toggleWrapper} variants={cardVariants}>
            <span
              className={`${styles.toggleLabel} ${billingCycle === 'monthly' ? styles.activeLabel : ''}`}
              onClick={() => setBillingCycle('monthly')}
            >
              {t('pricing.monthly')}
            </span>
            <button
              className={styles.toggleSwitch}
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              aria-label="Toggle billing cycle"
            >
              <div
                className={`${styles.toggleSlider} ${billingCycle === 'yearly' ? styles.toggleYearly : ''}`}
              />
            </button>
            <span
              className={`${styles.toggleLabel} ${billingCycle === 'yearly' ? styles.activeLabel : ''}`}
              onClick={() => setBillingCycle('yearly')}
            >
              {t('pricing.yearly')}
              <span className={styles.saveBadge}>20% OFF</span>
            </span>
          </motion.div>
        </div>

        {/* Pricing Cards Grid */}
        <div className={styles.cardsGrid}>
          {/* 1. FREE CARD */}
          <motion.div className={`${styles.card} ${styles.freeCard}`} variants={cardVariants}>
            <div className={styles.cardHeader}>
              <div className={styles.iconBoxFree}>
                <ShieldCheck size={24} />
              </div>
              <h3 className={styles.planName}>{freeData.name}</h3>
              <div className={styles.priceRow}>
                <span className={styles.price}>$0</span>
                <span className={styles.period}>/ month</span>
              </div>
            </div>

            <ul className={styles.featuresList}>
              {freeData.features.map((feature, idx) => (
                <li key={idx} className={styles.featureItem}>
                  <Check className={styles.checkIconFree} size={18} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <a
              href="#download"
              onClick={(e) => handleCtaClick(e, freeData.name)}
              className={styles.ctaFree}
            >
              Coming Soon
            </a>
          </motion.div>

          {/* 2. BASIC CARD (POPULAR) */}
          <motion.div className={`${styles.card} ${styles.basicCard}`} variants={cardVariants}>
            <div className={styles.popularBadge}>{t('pricing.popularBadge')}</div>
            <div className={styles.cardHeader}>
              <div className={styles.iconBoxBasic}>
                <Zap size={24} />
              </div>
              <h3 className={styles.planName}>{basicData.name}</h3>
              <div className={styles.priceRow}>
                {billingCycle === 'yearly' ? (
                  <>
                    <span className={styles.strikethroughPrice}>${basicMonthlyRate}</span>
                    <span className={styles.price}>${basicYearlyMonthlyRate}</span>
                    <span className={styles.period}>/ month</span>
                    <span className={styles.yearlySubText}>(${basicData.yearlyPrice}/yr)</span>
                  </>
                ) : (
                  <>
                    <span className={styles.price}>${basicMonthlyRate}</span>
                    <span className={styles.period}>/ month</span>
                  </>
                )}
              </div>
            </div>

            <ul className={styles.featuresList}>
              {basicData.features.map((feature, idx) => (
                <li key={idx} className={styles.featureItem}>
                  <Check className={styles.checkIconBasic} size={18} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <a
              href="#download"
              onClick={(e) => handleCtaClick(e, basicData.name)}
              className={styles.ctaBasic}
            >
              Coming Soon
            </a>
          </motion.div>

          {/* 3. PRO CARD */}
          <motion.div className={`${styles.card} ${styles.proCard}`} variants={cardVariants}>
            <div className={styles.cardHeader}>
              <div className={styles.iconBoxPro}>
                <Sparkles size={24} />
              </div>
              <h3 className={styles.planNamePro}>{proData.name}</h3>
              <div className={styles.priceRow}>
                {billingCycle === 'yearly' ? (
                  <>
                    <span className={styles.strikethroughPricePro}>${proMonthlyRate}</span>
                    <span className={styles.priceGold}>${proYearlyMonthlyRate}</span>
                    <span className={styles.period}>/ month</span>
                    <span className={styles.yearlySubText}>(${proData.yearlyPrice}/yr)</span>
                  </>
                ) : (
                  <>
                    <span className={styles.priceGold}>${proMonthlyRate}</span>
                    <span className={styles.period}>/ month</span>
                  </>
                )}
              </div>
            </div>

            <ul className={styles.featuresList}>
              {proData.features.map((feature, idx) => (
                <li key={idx} className={styles.featureItem}>
                  <Check className={styles.checkIconPro} size={18} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <a
              href="#download"
              onClick={(e) => handleCtaClick(e, proData.name)}
              className={styles.ctaPro}
            >
              Coming Soon
            </a>
          </motion.div>
        </div>

        {/* Note below all cards */}
        <motion.p className={styles.comingSoonNote} variants={cardVariants}>
          🔔 In-app purchases coming soon! Available on iOS and Android.
        </motion.p>
      </motion.div>
    </section>
  );
}
