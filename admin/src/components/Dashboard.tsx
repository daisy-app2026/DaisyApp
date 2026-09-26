import React, { useState, useEffect } from 'react';
import { getStats, getSubscriptionStats, clearAdminCache } from '../services/api';
import {
  Users,
  Activity,
  BookOpen,
  Clock,
  Heart,
  RotateCw,
  Lightbulb,
  AlertTriangle,
  DollarSign,
  CreditCard,
  TrendingUp,
  Trash2,
} from 'lucide-react';
import styles from './Dashboard.module.css';

interface StatsData {
  totalUsers: number;
  activeToday: number;
  totalEntries: number;
  totalPastSessions: number;
  totalCrushSessions: number;
}

interface SubscriptionStatsData {
  total: number;
  free: number;
  basic: number;
  pro: number;
  totalPaid: number;
  totalRevenue: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [subStats, setSubStats] = useState<SubscriptionStatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [clearingCache, setClearingCache] = useState<boolean>(false);
  const [cacheNotice, setCacheNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [statsRes, subStatsRes] = await Promise.all([
        getStats(),
        getSubscriptionStats(),
      ]);
      setStats(statsRes.data);
      setSubStats(subStatsRes.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch system stats. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = async () => {
    try {
      setClearingCache(true);
      await clearAdminCache();
      setCacheNotice('Server cache cleared successfully!');
      setTimeout(() => setCacheNotice(null), 3500);
      await fetchStats();
    } catch (err) {
      console.error('Clear cache error:', err);
      setError('Failed to clear server cache.');
    } finally {
      setClearingCache(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading system and revenue stats data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <AlertTriangle size={48} className={styles.errorIcon} />
        <p className={styles.errorText}>{error}</p>
        <button onClick={fetchStats} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  const totalUsersCount = subStats?.total || stats?.totalUsers || 0;
  const totalPaidCount = subStats?.totalPaid !== undefined
    ? subStats.totalPaid
    : ((subStats?.basic || 0) + (subStats?.pro || 0));
  const totalRevenueAmount = subStats?.totalRevenue ?? 0;
  const conversionRate = totalUsersCount > 0 ? ((totalPaidCount / totalUsersCount) * 100).toFixed(1) : '0.0';

  const financialCards = [
    {
      title: 'Monthly Revenue',
      value: `$${totalRevenueAmount.toFixed(2)}`,
      icon: <DollarSign className={styles.iconSvg} />,
      description: 'Total monthly recurring revenue (USD)',
      colorClass: styles.cardRevenue,
    },
    {
      title: 'Paid Members',
      value: `${totalPaidCount} users`,
      icon: <CreditCard className={styles.iconSvg} />,
      description: 'Active Basic ($8.99) & Pro ($14.99) subscribers',
      colorClass: styles.cardPaid,
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      icon: <TrendingUp className={styles.iconSvg} />,
      description: 'Percentage of total users converted to paid plans',
      colorClass: styles.cardConversion,
    },
  ];

  const operationalCards = [
    {
      title: 'Total Registered Users',
      value: stats?.totalUsers ?? 0,
      icon: <Users className={styles.iconSvg} />,
      description: 'Total accounts in auth database',
      colorClass: styles.cardUsers,
    },
    {
      title: 'Active Today',
      value: stats?.activeToday ?? 0,
      icon: <Activity className={styles.iconSvg} />,
      description: 'Users active in past 24 hours',
      colorClass: styles.cardActive,
    },
    {
      title: 'Journal Entries',
      value: stats?.totalEntries ?? 0,
      icon: <BookOpen className={styles.iconSvg} />,
      description: 'Total journal entries logged',
      colorClass: styles.cardEntries,
    },
    {
      title: 'Talk to Past Sessions',
      value: stats?.totalPastSessions ?? 0,
      icon: <Clock className={styles.iconSvg} />,
      description: 'Conversations with past self/relationships',
      colorClass: styles.cardPast,
    },
    {
      title: 'Talk to Crush Sessions',
      value: stats?.totalCrushSessions ?? 0,
      icon: <Heart className={styles.iconSvg} />,
      description: 'Relationship guidance simulator logs',
      colorClass: styles.cardCrush,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.heading}>Welcome back, Administrator!</h1>
          <p className={styles.subtext}>Here is the current operational & revenue status of the Daisy application.</p>
        </div>
        <div className={styles.headerActions}>
          <button
            onClick={handleClearCache}
            className={styles.cacheButton}
            disabled={clearingCache}
            title="Clear Server Cache"
          >
            <Trash2 size={14} /> {clearingCache ? 'Clearing...' : 'Clear Cache'}
          </button>
          <button onClick={fetchStats} className={styles.refreshButton} title="Refresh Statistics">
            <RotateCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {cacheNotice && <div className={styles.cacheNotice}>{cacheNotice}</div>}

      {/* Financial Metrics */}
      <div className={styles.sectionBlock}>
        <h2 className={styles.sectionTitle}>Revenue & Membership Overview</h2>
        <div className={styles.gridRow3}>
          {financialCards.map((card, idx) => (
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
      </div>

      {/* Operational Metrics */}
      <div className={styles.sectionBlock}>
        <h2 className={styles.sectionTitle}>Usage & Database Metrics</h2>
        <div className={styles.grid}>
          {operationalCards.map((card, idx) => (
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
      </div>

      <div className={styles.quickActions}>
        <h3 className={styles.actionsHeading}>System Quick Actions</h3>
        <div className={styles.actionButtons}>
          <div className={styles.infoBox}>
            <Lightbulb size={24} className={styles.infoIcon} />
            <p className={styles.infoText}>
              Backend data is cached for 5 minutes for maximum speed. Click "Clear Cache" anytime to force immediate live database queries. Use the sidebar to send broadcast push notifications or inspect detailed user growth analytics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
