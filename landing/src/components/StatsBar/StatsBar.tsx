import { motion } from 'framer-motion';
import styles from './StatsBar.module.css';

interface StatItem {
  number: string;
  label: string;
}

export default function StatsBar() {
  const stats: StatItem[] = [
    { number: '3', label: 'Core Features' },
    { number: '∞', label: 'Healing Conversations' },
    { number: '100%', label: 'Safe & Private' }
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
