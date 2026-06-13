import React, { useState, useEffect } from 'react';
import { getAnalytics } from '../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import styles from './Analytics.module.css';

interface DayAnalytics {
  date: string;
  entries: number;
}

const Analytics: React.FC = () => {
  const [data, setData] = useState<DayAnalytics[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await getAnalytics();
      setData(res.data.days);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch analytics metrics. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const getPeakDay = () => {
    if (data.length === 0) return { date: '', entries: 0 };
    return data.reduce((peak, day) => (day.entries > peak.entries ? day : peak), data[0]);
  };

  const getWeeklySum = () => {
    return data.reduce((acc, cur) => acc + cur.entries, 0);
  };

  const getDailyAverage = () => {
    if (data.length === 0) return 0;
    return getWeeklySum() / data.length;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Analyzing journal trends...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <span className={styles.errorIcon}>⚠️</span>
        <p className={styles.errorText}>{error}</p>
        <button onClick={fetchAnalytics} className={styles.retryButton}>Retry</button>
      </div>
    );
  }

  const peak = getPeakDay();

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.heading}>Journal Analytics</h1>
          <p className={styles.subtext}>Monitor user journal entry volumes over the past 7 days.</p>
        </div>
        <button onClick={fetchAnalytics} className={styles.refreshButton}>
          🔄 Refresh
        </button>
      </div>

      <div className={styles.chartCard}>
        <h3 className={styles.chartHeading}>Total Entries Over Past 7 Days</h3>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height={360}>
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={formatDateLabel}
                stroke="#94A3B8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#94A3B8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dx={-10}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                }}
                labelFormatter={(label) => {
                  if (!label) return '';
                  const date = new Date(label);
                  return date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                }}
                formatter={(value) => [`${value} entries`, 'Journal Entries']}
              />
              <Line
                type="monotone"
                dataKey="entries"
                stroke="#1A3A0F"
                strokeWidth={3}
                dot={{ stroke: '#F2DB4A', strokeWidth: 2, r: 6, fill: '#1A3A0F' }}
                activeDot={{ stroke: '#1A3A0F', strokeWidth: 2, r: 8, fill: '#F2DB4A' }}
                animationDuration={1200}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryBadge}>📈 Peak Day</span>
          <p className={styles.summaryValue}>
            {peak.entries} entries
          </p>
          <p className={styles.summaryLabel}>
            on {formatDateLabel(peak.date)}
          </p>
        </div>
        
        <div className={styles.summaryCard}>
          <span className={styles.summaryBadge}>📊 Weekly Sum</span>
          <p className={styles.summaryValue}>
            {getWeeklySum()} entries
          </p>
          <p className={styles.summaryLabel}>Total written this week</p>
        </div>

        <div className={styles.summaryCard}>
          <span className={styles.summaryBadge}>🧮 Daily Average</span>
          <p className={styles.summaryValue}>
            {getDailyAverage().toFixed(1)} entries
          </p>
          <p className={styles.summaryLabel}>Average user submissions per day</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
