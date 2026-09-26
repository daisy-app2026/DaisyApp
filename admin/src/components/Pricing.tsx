import React, { useState, useEffect } from 'react';
import { getPricing, updatePricing, getSubscriptionStats } from '../services/api';
import { CheckCircle, Save, Info, Sparkles, Zap, ShieldCheck, TrendingUp } from 'lucide-react';
import styles from './Pricing.module.css';

export interface PlanData {
  name: string;
  monthlyPrice: number | string;
  yearlyPrice: number | string;
  originalYearlyPrice?: number | string;
  discountPercent?: number | string;
  chatLimit: number | string;
  messageLimit: number | string;
  features: string[] | string;
  isPopular: boolean;
  isActive: boolean;
}

export type PricingState = Record<'free' | 'basic' | 'pro', PlanData>;

export interface SubscriptionStatsData {
  total: number;
  free: number;
  basic: number;
  pro: number;
  totalPaid?: number;
  totalRevenue?: number;
  recentSubscriptions: Array<{
    userId: string;
    email: string;
    name: string;
    plan: string;
    date: string;
  }>;
}

const DEFAULT_PLANS: PricingState = {
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

const AdminPricing: React.FC = () => {
  const [plans, setPlans] = useState<PricingState>(DEFAULT_PLANS);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [stats, setStats] = useState<SubscriptionStatsData | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    fetchPricingFromBackend();
    fetchSubscriptionStats();
  }, []);

  const fetchSubscriptionStats = async () => {
    try {
      const res = await getSubscriptionStats();
      if (res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.log('Failed to fetch subscription stats:', err);
    }
  };

  const fetchPricingFromBackend = async () => {
    try {
      setLoading(true);
      const res = await getPricing();
      const loadedPlans = res.data?.plans || res.data;
      if (loadedPlans && loadedPlans.free) {
        setPlans(loadedPlans);
      }
    } catch {
      // Keep default plans if offline
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (
    planKey: 'free' | 'basic' | 'pro',
    field: keyof PlanData,
    val: unknown
  ) => {
    setPlans((prev) => {
      const plan = { ...prev[planKey], [field]: val };

      // Recalculate discount if prices change
      if (field === 'monthlyPrice' || field === 'yearlyPrice') {
        const m = parseFloat(String(field === 'monthlyPrice' ? val : plan.monthlyPrice)) || 0;
        const y = parseFloat(String(field === 'yearlyPrice' ? val : plan.yearlyPrice)) || 0;

        if (m > 0) {
          const orig = Math.round(m * 12 * 100) / 100;
          plan.originalYearlyPrice = orig;
          if (y > 0 && y < orig) {
            plan.discountPercent = Math.round(((orig - y) / orig) * 100);
          } else {
            plan.discountPercent = 0;
          }
        }
      }

      return {
        ...prev,
        [planKey]: plan,
      };
    });
  };

  const saveAllPlansToBackend = async (keyToSave?: 'free' | 'basic' | 'pro') => {
    try {
      setSavingKey(keyToSave || 'all');
      
      // Clean features into array format
      const formattedPlans: PricingState = { ...plans };
      (['free', 'basic', 'pro'] as const).forEach((pk) => {
        const feat = formattedPlans[pk].features;
        if (typeof feat === 'string') {
          formattedPlans[pk].features = (feat as string)
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean);
        }
      });

      await updatePricing({ plans: formattedPlans });
      setPlans(formattedPlans);
      showToast(
        keyToSave
          ? `Saved ${formattedPlans[keyToSave].name} plan! Changes reflect live on landing page.`
          : 'Saved all pricing plans! Changes reflect live on landing page.'
      );
    } catch {
      showToast('Failed to save to backend. Verify admin connection.');
    } finally {
      setSavingKey(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading Pricing Plans from Firestore...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {toastMessage && (
        <div className={styles.toast}>
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.heading}>Subscription Plans & Pricing</h1>
          <p className={styles.subtext}>
            Manage subscription plans. Changes saved here reflect live on the Daisy landing page!
          </p>
        </div>
        <button
          type="button"
          className={styles.saveAllBtn}
          onClick={() => saveAllPlansToBackend()}
          disabled={savingKey === 'all'}
        >
          <Save size={16} />
          <span>{savingKey === 'all' ? 'Saving All...' : 'Save All Pricing'}</span>
        </button>
      </div>

      <div className={styles.plansGrid}>
        {(['free', 'basic', 'pro'] as const).map((planKey) => {
          const plan = plans[planKey];
          const featuresStr = Array.isArray(plan.features)
            ? plan.features.join('\n')
            : plan.features;

          const mPrice = parseFloat(String(plan.monthlyPrice)) || 0;
          const yPrice = parseFloat(String(plan.yearlyPrice)) || 0;
          const origYPrice =
            parseFloat(String(plan.originalYearlyPrice || mPrice * 12)) || mPrice * 12;
          const discVal =
            mPrice > 0 && yPrice > 0 && yPrice < origYPrice
              ? Math.round(((origYPrice - yPrice) / origYPrice) * 100)
              : plan.discountPercent || 0;
          const discNum = typeof discVal === 'number' ? discVal : parseFloat(String(discVal)) || 0;

          return (
            <div
              key={planKey}
              className={`${styles.card} ${
                planKey === 'free'
                  ? styles.cardFree
                  : planKey === 'basic'
                  ? styles.cardBasic
                  : styles.cardPro
              }`}
            >
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderTitle}>
                  {planKey === 'free' && <ShieldCheck size={20} className={styles.iconFree} />}
                  {planKey === 'basic' && <Zap size={20} className={styles.iconBasic} />}
                  {planKey === 'pro' && <Sparkles size={20} className={styles.iconPro} />}
                  <span>{planKey.toUpperCase()} PLAN</span>
                </div>
                <div className={styles.badgeGroup}>
                  {plan.isPopular && <span className={styles.popularBadge}>POPULAR</span>}
                  {discNum > 0 && <span className={styles.discountBadge}>SAVE {discNum}%</span>}
                  <span
                    className={`${styles.statusBadge} ${
                      plan.isActive ? styles.activeBadge : styles.inactiveBadge
                    }`}
                  >
                    {plan.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>
              </div>

              <div className={styles.formSection}>
                {/* Plan Name */}
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Plan Name</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={plan.name}
                    onChange={(e) => handleFieldChange(planKey, 'name', e.target.value)}
                  />
                </div>

                {/* Pricing Inputs */}
                <div className={styles.twoColumn}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Monthly Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className={styles.input}
                      value={plan.monthlyPrice}
                      onChange={(e) =>
                        handleFieldChange(planKey, 'monthlyPrice', parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Yearly Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className={styles.input}
                      value={plan.yearlyPrice}
                      onChange={(e) =>
                        handleFieldChange(planKey, 'yearlyPrice', parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                </div>

                {/* Discount Info Banner */}
                {discNum > 0 && (
                  <div className={styles.discountCalcBanner}>
                    <span>Auto-calculated discount: <strong>{discNum}% OFF</strong></span>
                    <span className={styles.originalStrikethrough}>
                      Original: ${origYPrice.toFixed(2)}/yr
                    </span>
                  </div>
                )}

                {/* Limits */}
                <div className={styles.twoColumn}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Chat Limit (-1 = Unlimited)</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={plan.chatLimit}
                      onChange={(e) => handleFieldChange(planKey, 'chatLimit', e.target.value)}
                      placeholder="3, 10, or -1"
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Message Limit</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={plan.messageLimit}
                      onChange={(e) => handleFieldChange(planKey, 'messageLimit', e.target.value)}
                      placeholder="30, 150, 500"
                    />
                  </div>
                </div>

                {/* Features List */}
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Features (1 feature per line)</label>
                  <textarea
                    rows={6}
                    className={styles.textarea}
                    value={featuresStr}
                    onChange={(e) => handleFieldChange(planKey, 'features', e.target.value)}
                  />
                </div>

                {/* Toggles */}
                <div className={styles.togglesRow}>
                  <label className={styles.toggleItem}>
                    <input
                      type="checkbox"
                      checked={plan.isPopular}
                      onChange={(e) => handleFieldChange(planKey, 'isPopular', e.target.checked)}
                    />
                    <span>Is Popular</span>
                  </label>

                  <label className={styles.toggleItem}>
                    <input
                      type="checkbox"
                      checked={plan.isActive}
                      onChange={(e) => handleFieldChange(planKey, 'isActive', e.target.checked)}
                    />
                    <span>Is Active</span>
                  </label>
                </div>

                {/* Save Button */}
                <button
                  type="button"
                  className={styles.saveBtn}
                  onClick={() => saveAllPlansToBackend(planKey)}
                  disabled={savingKey === planKey}
                >
                  <Save size={16} />
                  <span>{savingKey === planKey ? 'Saving...' : 'Save Plan'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Note at bottom */}
      <div className={styles.noteBanner}>
        <Info size={18} className={styles.noteIcon} />
        <span>
          Note: Plan names and features are in English only. The app handles translations automatically.
        </span>
      </div>

      {/* Subscription Analytics Section */}
      <div className={styles.analyticsSection}>
        <div className={styles.analyticsTitle}>
          <TrendingUp size={20} color="#10B981" />
          <span>Subscription Analytics</span>
        </div>

        <div className={styles.analyticsStatsGrid}>
          <div className={styles.analyticsStatCard}>
            <span className={styles.statCardLabel}>Total Paid Users</span>
            <span className={styles.statCardValue}>
              {stats?.totalPaid !== undefined ? stats.totalPaid : (stats?.basic || 0) + (stats?.pro || 0)}
            </span>
          </div>
          <div className={styles.analyticsStatCard}>
            <span className={styles.statCardLabel}>Free Users</span>
            <span className={styles.statCardValue}>{stats?.free ?? 0}</span>
          </div>
          <div className={styles.analyticsStatCard}>
            <span className={styles.statCardLabel}>Basic Plan Users</span>
            <span className={styles.statCardValue}>{stats?.basic ?? 0}</span>
          </div>
          <div className={styles.analyticsStatCard}>
            <span className={styles.statCardLabel}>Pro Plan Users</span>
            <span className={styles.statCardValue}>{stats?.pro ?? 0}</span>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-color, #111827)' }}>
            Recent Subscriptions (Last 10)
          </h4>
          {stats?.recentSubscriptions && stats.recentSubscriptions.length > 0 ? (
            <div className={styles.tableContainer}>
              <table className={styles.recentTable}>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Plan</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentSubscriptions.map((sub, idx) => (
                    <tr key={sub.userId || idx}>
                      <td>{sub.name}</td>
                      <td>{sub.email}</td>
                      <td>
                        <span
                          className={`${styles.planPill} ${
                            sub.plan === 'basic'
                              ? styles.planBasicPill
                              : sub.plan === 'pro'
                              ? styles.planProPill
                              : styles.planFreePill
                          }`}
                        >
                          {sub.plan.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        {new Date(sub.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ fontSize: '13px', color: '#6B7280' }}>No recent active subscriptions found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPricing;
