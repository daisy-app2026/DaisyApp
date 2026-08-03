import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import styles from './StatsBar.module.css';

interface StatItem {
  number: string;
  label: string;
}

export default function StatsBar() {
  const { t } = useLanguage();

  const stats: StatItem[] = [
    { number: t('stats.coreFeaturesNum'), label: t('stats.coreFeaturesLabel') },
    { number: t('stats.healingConversationsNum'), label: t('stats.healingConversationsLabel') },
    { number: t('stats.safePrivateNum'), label: t('stats.safePrivateLabel') }
  ];

  return (
    <section className={styles.statsBar}>
      <div className={styles.statsGrid}>
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            className={styles.statCard}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <div className={styles.statNumber}>{stat.number}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
