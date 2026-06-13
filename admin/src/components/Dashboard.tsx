import React, { useState, useEffect } from 'react';
import { getStats } from '../services/api';
import styles from './Dashboard.module.css';

interface StatsData {
  totalUsers: number;
  activeToday: number;
  totalEntries: number;
  totalPastSessions: number;
  totalCrushSessions: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getStats();
      setStats(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch system stats. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading stats data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <span className={styles.errorIcon}>⚠️</span>
        <p className={styles.errorText}>{error}</p>
        <button onClick={fetchStats} className={styles.retryButton}>Retry</button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Registered Users',
      value: stats?.totalUsers ?? 0,
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={styles.iconSvg}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      description: 'Total accounts in auth database',
      colorClass: styles.cardUsers
    },
    {
      title: 'Active Today',
      value: stats?.activeToday ?? 0,
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={styles.iconSvg}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      description: 'Users seen in the past 24 hours',
      colorClass: styles.cardActive
    },
    {
      title: 'Journal Entries',
      value: stats?.totalEntries ?? 0,
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={styles.iconSvg}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      description: 'Total journal entries logged',
      colorClass: styles.cardEntries
    },
    {
      title: 'Talk to Past Sessions',
      value: stats?.totalPastSessions ?? 0,
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={styles.iconSvg}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: 'Conversations with past self/relationships',
      colorClass: styles.cardPast
    },
    {
      title: 'Talk to Crush Sessions',
      value: stats?.totalCrushSessions ?? 0,
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={styles.iconSvg}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      description: 'Relationship guidance simulator logs',
      colorClass: styles.cardCrush
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.heading}>Welcome back, Administrator!</h1>
          <p className={styles.subtext}>Here is the current operational status of the Daisy application.</p>
        </div>
        <button onClick={fetchStats} className={styles.refreshButton} title="Refresh Statistics">
          🔄 Refresh
        </button>
      </div>

      <div className={styles.grid}>
        {statCards.map((card, idx) => (
          <div key={idx} className={`${styles.card} ${card.colorClass}`}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <div className={styles.iconWrapper}>{card.icon}</div>
            </div>
            <div className={styles.cardBody}>
              <span className={styles.cardValue}>{card.value}</span>
            </div>
            <div className={styles.cardFooter}>
              <p className={styles.cardDesc}>{card.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.quickActions}>
        <h3 className={styles.actionsHeading}>System Quick Actions</h3>
        <div className={styles.actionButtons}>
          <div className={styles.infoBox}>
            <span className={styles.infoEmoji}>💡</span>
            <p className={styles.infoText}>Daisy database snapshots are refreshed instantly. Use the sidebar to broadcast push notifications to active users, check usage analytics for the past 7 days, or adjust application-wide terms and policies.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
