import React, { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { Check, Shield, Zap, Sparkles, ArrowLeft, Smartphone, CheckCircle2, XCircle } from 'lucide-react';
import styles from './Billing.module.css';

declare global {
  interface Window {
    Paddle?: {
      Initialize: (config: { token: string; environment?: string }) => void;
      Environment?: {
        set: (env: string) => void;
      };
      Checkout: {
        open: (options: {
          items: Array<{ priceId: string; quantity: number }>;
          customData?: Record<string, unknown>;
          customer?: { email?: string };
          eventCallback?: (event: { name: string; data?: unknown }) => void;
        }) => void;
      };
    };
  }
}

interface UserPlanInfo {
  plan: 'free' | 'basic' | 'pro';
  planExpiresAt?: string | null;
  paddleSubscriptionId?: string | null;
}

type PaymentStatus = 'idle' | 'loading' | 'success' | 'failed';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function BillingPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [userPlanInfo, setUserPlanInfo] = useState<UserPlanInfo>({ plan: 'free' });

  // Auth form states
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [appleEmail, setAppleEmail] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState<boolean>(false);
  const [appleMsg, setAppleMsg] = useState<string | null>(null);

  // Billing toggle state & Payment status
  const [isYearly, setIsYearly] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [purchasedPlan, setPurchasedPlan] = useState<'basic' | 'pro'>('basic');
  const [cancelLoading, setCancelLoading] = useState<boolean>(false);
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserPlan(user);
      } else {
        setUserPlanInfo({ plan: 'free' });
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN || 'test_01m3ea9mz8c4c5sfvzb17bx751';
    if (window.Paddle) {
      try {
        window.Paddle.Initialize({ token });
      } catch (err) {
        console.warn('Paddle initialization warning:', err);
      }
    }
  }, []);

  const fetchUserPlan = async (user: User) => {
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${API_URL}/api/auth/user/${user.uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUserPlanInfo({
            plan: data.user.plan || 'free',
            planExpiresAt: data.user.planExpiresAt || null,
            paddleSubscriptionId: data.user.paddleSubscriptionId || null,
          });
        }
      }
    } catch (error) {
      console.log('Error fetching user plan:', error);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!email || !password) {
      setAuthError('Please enter email and password');
      return;
    }

    try {
      setAuthSubmitting(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/wrong-password'
      ) {
        setAuthError('No account found! Please download the Daisy app to create your account first.');
      } else {
        setAuthError(error.message || 'Authentication failed');
      }
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      setAuthSubmitting(true);
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/account-exists-with-different-credential'
      ) {
        setAuthError('No account found! Please download the Daisy app to create your account first.');
      } else {
        setAuthError(error.message || 'Google sign-in failed');
      }
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleAppleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAppleMsg(null);
    if (!appleEmail) {
      setAuthError('Please enter your Apple ID email');
      return;
    }

    try {
      setAuthSubmitting(true);
      await sendPasswordResetEmail(auth, appleEmail);
      setAppleMsg(`Password reset instructions sent to ${appleEmail}. Please check your inbox to access your account.`);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setAuthError(error.message || 'Could not verify Apple ID email.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setPaymentStatus('idle');
  };

  const handleBuyPlan = (planKey: 'basic' | 'pro') => {
    if (!currentUser) return;
    setAuthError(null);
    setPurchasedPlan(planKey);

    const priceIdMap = {
      basic: {
        monthly: import.meta.env.VITE_PADDLE_BASIC_MONTHLY_ID || 'pri_01m3ea_basic_monthly',
        yearly: import.meta.env.VITE_PADDLE_BASIC_YEARLY_ID || 'pri_01m3ea_basic_yearly',
      },
      pro: {
        monthly: import.meta.env.VITE_PADDLE_PRO_MONTHLY_ID || 'pri_01m3ea_pro_monthly',
        yearly: import.meta.env.VITE_PADDLE_PRO_YEARLY_ID || 'pri_01m3ea_pro_yearly',
      },
    };

    const targetPriceId = isYearly ? priceIdMap[planKey].yearly : priceIdMap[planKey].monthly;

    if (window.Paddle) {
      try {
        setActionLoading(true);
        window.Paddle.Checkout.open({
          items: [{ priceId: targetPriceId, quantity: 1 }],
          customData: { userId: currentUser.uid },
          customer: { email: currentUser.email || '' },
          eventCallback: (event) => {
            if (event.name === 'checkout.completed') {
              setPaymentStatus('loading');
              setTimeout(async () => {
                await fetchUserPlan(currentUser);
                setPaymentStatus('success');
              }, 3500);
            } else if (event.name === 'checkout.error') {
              setPaymentStatus('failed');
            } else if (event.name === 'checkout.closed') {
              if (paymentStatus === 'loading') {
                setPaymentStatus('idle');
              }
            }
          },
        });
      } catch (err) {
        console.error('Paddle open error:', err);
        setAuthError('Failed to open checkout window. Please try again.');
        setPaymentStatus('failed');
      } finally {
        setActionLoading(false);
      }
    } else {
      setAuthError('Paddle SDK loading. Please refresh and try again.');
    }
  };

  const handleCancelSubscription = async () => {
    if (!currentUser) return;
    try {
      setCancelLoading(true);
      setAuthError(null);
      const res = await fetch(`${API_URL}/api/paddle/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.uid }),
      });
      const data = await res.json();
      if (res.ok) {
        setCancelSuccess('Your subscription has been cancelled and set to free.');
        await fetchUserPlan(currentUser);
      } else {
        setAuthError(data.error || 'Failed to cancel subscription');
      }
    } catch (err) {
      setAuthError('Network error cancelling subscription');
    } finally {
      setCancelLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <p>Connecting to Daisy safe space...</p>
      </div>
    );
  }

  // CASE 3: Success Screen
  if (paymentStatus === 'success') {
    return (
      <div className={styles.billingContainer}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <CheckCircle2 size={56} className={styles.iconYellow} />
          </div>
          <h2 className={styles.successTitle}>Payment Successful! 🌼</h2>
          <p className={styles.successDesc}>
            Welcome to Daisy {purchasedPlan.toUpperCase()}! Your safe space plan has been upgraded.
          </p>

          <div className={styles.planDetailBox}>
            {purchasedPlan === 'basic'
              ? 'Basic Plan: 10 AI chats / month • 150 messages / month'
              : 'Pro Plan: Unlimited AI chats • 500 messages / month'}
          </div>

          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() => (window.location.href = 'daisy://billing/success')}
          >
            Open Daisy App
          </button>

          <a href="/" className={styles.homeLink}>
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  // CASE 3: Failed Screen
  if (paymentStatus === 'failed') {
    return (
      <div className={styles.billingContainer}>
        <div className={styles.successCard} style={{ borderColor: 'rgba(239, 68, 68, 0.5)' }}>
          <div className={styles.successIcon}>
            <XCircle size={56} color="#EF4444" />
          </div>
          <h2 className={styles.successTitle} style={{ color: '#FCA5A5' }}>
            Payment Failed
          </h2>
          <p className={styles.successDesc}>
            Don't worry, you haven't been charged. Please try again or contact support.
          </p>

          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() => setPaymentStatus('idle')}
          >
            Try Again
          </button>

          <a href="mailto:support@daisyapp.com" className={styles.homeLink}>
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.billingContainer}>
      {/* CASE 2: Full Screen Loading Overlay */}
      {paymentStatus === 'loading' && (
        <div className={styles.fullOverlay}>
          <div className={styles.spinner}></div>
          <div className={styles.overlayText}>Processing your payment...</div>
          <div className={styles.overlaySubtext}>Please don't close this page!</div>
        </div>
      )}

      <div className={styles.headerSection}>
        <span className={styles.badge}>DAISY PREMIUM PLANS</span>
        <h1 className={styles.title}>Unlock Your Safe Space</h1>
        <p className={styles.subtitle}>
          Choose the right plan for your mental wellness journey. Cancel anytime.
        </p>
      </div>

      {authError && <div className={styles.errorBanner}>{authError}</div>}
      {cancelSuccess && (
        <div
          className={styles.errorBanner}
          style={{ background: 'rgba(16, 185, 129, 0.2)', borderColor: 'rgba(16, 185, 129, 0.4)', color: '#6EE7B7' }}
        >
          {cancelSuccess}
        </div>
      )}

      {/* STEP 2: Auth Check / Login Section */}
      {!currentUser ? (
        <>
          <div className={styles.infoGrid}>
            <div className={styles.infoBox}>
              <div className={styles.infoIcon}>
                <Smartphone size={24} className={styles.iconYellow} />
              </div>
              <h3 className={styles.infoTitle}>Already using Daisy app?</h3>
              <p className={styles.infoText}>
                Sign in with the same email or Google account you use in the app.
              </p>
            </div>

            <div className={styles.infoBox}>
              <div className={styles.infoIcon}>
                <Sparkles size={24} className={styles.iconYellow} />
              </div>
              <h3 className={styles.infoTitle}>New to Daisy?</h3>
              <p className={styles.infoText}>
                Download the app first to create your account!
              </p>
              <div className={styles.storeButtonsRow}>
                <a href="#download" className={styles.storeBtn}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.11-1.92.99-3.04-.96.04-2.13.64-2.81 1.44-.61.71-1.14 1.86-.99 2.97 1.07.08 2.15-.57 2.81-1.37z"/>
                  </svg>
                  App Store
                </a>
                <a href="#download" className={styles.storeBtn}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.6 2.3c-.2.2-.3.6-.3 1v17.4c0 .4.1.8.3 1l9.1-9.7L3.6 2.3zm10.5 8.7L18.4 8l-3.3-1.9-4.3 4.9 3.3 3.3zm-1.4 1.4L4.3 21l11.4-6.6-3-3.1zm1.4-7.4l3.3 1.9L19 5.6c.4-.2.6-.6.6-1s-.2-.8-.6-1L14.1 5zm0 0"/>
                  </svg>
                  Play Store
                </a>
              </div>
            </div>
          </div>

          <div className={styles.authCard}>
            <h2 className={styles.authTitle}>Sign in to continue</h2>
            <p className={styles.authSubtitle}>Use your Daisy app account</p>

            <form onSubmit={handleEmailAuth} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Email Address</label>
                <input
                  type="email"
                  className={styles.input}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Password</label>
                <input
                  type="password"
                  className={styles.input}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className={styles.primaryBtn} disabled={authSubmitting}>
                {authSubmitting ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className={styles.divider}>
              <span>or</span>
            </div>

            <button type="button" className={styles.googleBtn} onClick={handleGoogleSignIn} disabled={authSubmitting}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className={styles.divider}>
              <span>or</span>
            </div>

            <div className={styles.appleSection}>
              <p className={styles.appleText}>Signed in with Apple?</p>
              <p className={styles.appleSubtext}>Enter your Apple ID email to access your subscription options.</p>
              <form onSubmit={handleAppleEmailSubmit} className={styles.form}>
                <input
                  type="email"
                  className={styles.input}
                  placeholder="apple.id@example.com"
                  value={appleEmail}
                  onChange={(e) => setAppleEmail(e.target.value)}
                />
                <button type="submit" className={styles.primaryBtn} disabled={authSubmitting}>
                  Continue with Apple Email
                </button>
              </form>
              {appleMsg && <p style={{ fontSize: '12px', color: '#6EE7B7', marginTop: '8px' }}>{appleMsg}</p>}
            </div>
          </div>
        </>
      ) : (
        /* STEP 3: Plan Selection & Manage Subscription (when logged in) */
        <>
          <div className={styles.userBar}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className={styles.userEmail}>{currentUser.email}</div>
                <div className={styles.userPlanText}>
                  Current Plan: <strong className={styles.userPlanBadge}>{userPlanInfo.plan}</strong>
                </div>
              </div>
            </div>
            <button type="button" className={styles.signOutLink} onClick={handleSignOut}>
              Sign Out
            </button>
          </div>

          {(userPlanInfo.plan === 'basic' || userPlanInfo.plan === 'pro') && (
            <div className={styles.manageCard}>
              <div className={styles.manageHeader}>
                <span className={styles.manageTitle}>Manage Subscription</span>
                <span className={styles.planBadgePill}>{userPlanInfo.plan} PLAN</span>
              </div>
              <div className={styles.manageDetails}>
                <div>
                  Next billing date:{' '}
                  <strong>
                    {userPlanInfo.planExpiresAt
                      ? new Date(userPlanInfo.planExpiresAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Active'}
                  </strong>
                </div>
              </div>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={handleCancelSubscription}
                disabled={cancelLoading}
              >
                {cancelLoading ? 'Cancelling...' : 'Cancel Subscription'}
              </button>
            </div>
          )}

          <div className={styles.toggleContainer}>
            <span
              className={`${styles.toggleLabel} ${!isYearly ? styles.toggleLabelActive : ''}`}
              onClick={() => setIsYearly(false)}
            >
              Monthly
            </span>

            <label className={styles.switch}>
              <input type="checkbox" checked={isYearly} onChange={(e) => setIsYearly(e.target.checked)} />
              <span className={styles.slider}></span>
            </label>

            <span
              className={`${styles.toggleLabel} ${isYearly ? styles.toggleLabelActive : ''}`}
              onClick={() => setIsYearly(true)}
            >
              Yearly <span className={styles.discountPill}>20% OFF</span>
            </span>
          </div>

          <div className={styles.plansGrid}>
            {/* FREE PLAN */}
            <div className={styles.planCard}>
              <div>
                <div className={styles.planHeader}>
                  <div className={styles.planName}>Free</div>
                  <div className={styles.planPriceRow}>
                    <span className={styles.priceSymbol}>$</span>
                    <span className={styles.priceAmount}>0</span>
                    <span className={styles.pricePeriod}>/ forever</span>
                  </div>
                </div>

                <ul className={styles.featureList}>
                  <li className={styles.featureItem}>
                    <Check size={16} className={styles.featureIcon} />
                    <span>3 AI chats total</span>
                  </li>
                  <li className={styles.featureItem}>
                    <Check size={16} className={styles.featureIcon} />
                    <span>30 messages total</span>
                  </li>
                  <li className={styles.featureItem}>
                    <Check size={16} className={styles.featureIcon} />
                    <span>Unlimited diary journaling</span>
                  </li>
                  <li className={styles.featureItem}>
                    <Check size={16} className={styles.featureIcon} />
                    <span>Memory capsule access</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                className={`${styles.planBtn} ${userPlanInfo.plan === 'free' ? styles.planBtnDisabled : ''}`}
                disabled={userPlanInfo.plan === 'free'}
              >
                {userPlanInfo.plan === 'free' ? 'Current Plan' : 'Free Plan'}
              </button>
            </div>

            {/* BASIC PLAN */}
            <div className={`${styles.planCard} ${styles.planCardPopular}`}>
              <div className={styles.popularBadge}>MOST POPULAR</div>
              <div>
                <div className={styles.planHeader}>
                  <div className={styles.planName}>Basic</div>
                  <div className={styles.planPriceRow}>
                    <span className={styles.priceSymbol}>$</span>
                    <span className={styles.priceAmount}>{isYearly ? '7.19' : '8.99'}</span>
                    <span className={styles.pricePeriod}>/ month</span>
                  </div>
                </div>

                <ul className={styles.featureList}>
                  <li className={styles.featureItem}>
                    <Check size={16} className={styles.featureIcon} />
                    <span>10 AI chats/month</span>
                  </li>
                  <li className={styles.featureItem}>
                    <Check size={16} className={styles.featureIcon} />
                    <span>150 messages/month</span>
                  </li>
                  <li className={styles.featureItem}>
                    <Check size={16} className={styles.featureIcon} />
                    <span>Unlimited diary journaling</span>
                  </li>
                  <li className={styles.featureItem}>
                    <Check size={16} className={styles.featureIcon} />
                    <span>Audio & image entries</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                className={`${styles.planBtn} ${userPlanInfo.plan === 'basic' ? styles.planBtnDisabled : ''}`}
                onClick={() => handleBuyPlan('basic')}
                disabled={userPlanInfo.plan === 'basic' || actionLoading}
              >
                {userPlanInfo.plan === 'basic' ? 'Current Plan' : actionLoading ? 'Loading...' : 'Get Basic'}
              </button>
            </div>

            {/* PRO PLAN */}
            <div className={styles.planCard}>
              <div>
                <div className={styles.planHeader}>
                  <div className={styles.planName}>Pro</div>
                  <div className={styles.planPriceRow}>
                    <span className={styles.priceSymbol}>$</span>
                    <span className={styles.priceAmount}>{isYearly ? '11.99' : '14.99'}</span>
                    <span className={styles.pricePeriod}>/ month</span>
                  </div>
                </div>

                <ul className={styles.featureList}>
                  <li className={styles.featureItem}>
                    <Check size={16} className={styles.featureIcon} />
                    <span>Unlimited AI chats</span>
                  </li>
                  <li className={styles.featureItem}>
                    <Check size={16} className={styles.featureIcon} />
                    <span>500 messages/month</span>
                  </li>
                  <li className={styles.featureItem}>
                    <Check size={16} className={styles.featureIcon} />
                    <span>Unlimited diary journaling</span>
                  </li>
                  <li className={styles.featureItem}>
                    <Check size={16} className={styles.featureIcon} />
                    <span>Priority support & early access</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                className={`${styles.planBtn} ${userPlanInfo.plan === 'pro' ? styles.planBtnDisabled : ''}`}
                onClick={() => handleBuyPlan('pro')}
                disabled={userPlanInfo.plan === 'pro' || actionLoading}
              >
                {userPlanInfo.plan === 'pro' ? 'Current Plan' : actionLoading ? 'Loading...' : 'Get Pro'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
