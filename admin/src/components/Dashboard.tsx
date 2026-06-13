import React, { useState, useEffect } from 'react';
import { getStats } from '../services/api';
import { Users, Activity, BookOpen, Clock, Heart, RotateCw, Lightbulb, AlertTriangle } from 'lucide-react';
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
        <AlertTriangle size={48} className={styles.errorIcon} />
        <p className={styles.errorText}>{error}</p>
        <button onClick={fetchStats} className={styles.retryButton}>Retry</button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Registered Users',
      value: stats?.totalUsers ?? 0,
      icon: <Users className={styles.iconSvg} />,
      description: 'Total accounts in auth database',
      colorClass: styles.cardUsers
    },
    {
      title: 'Active Today',
      value: stats?.activeToday ?? 0,
      icon: <Activity className={styles.iconSvg} />,
      description: 'Users seen in the past 24 hours',
      colorClass: styles.cardActive
    },
    {
      title: 'Journal Entries',
      value: stats?.totalEntries ?? 0,
      icon: <BookOpen className={styles.iconSvg} />,
      description: 'Total journal entries logged',
      colorClass: styles.cardEntries
    },
    {
      title: 'Talk to Past Sessions',
      value: stats?.totalPastSessions ?? 0,
      icon: <Clock className={styles.iconSvg} />,
      description: 'Conversations with past self/relationships',
      colorClass: styles.cardPast
    },
    {
      title: 'Talk to Crush Sessions',
      value: stats?.totalCrushSessions ?? 0,
      icon: <Heart className={styles.iconSvg} />,
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
          <RotateCw size={14} /> Refresh
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
            <Lightbulb size={24} className={styles.infoIcon} />
            <p className={styles.infoText}>Daisy database snapshots are refreshed instantly. Use the sidebar to broadcast push notifications to active users, check usage analytics for the past 7 days, or adjust application-wide terms and policies.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
