import React, { useState } from 'react';
import styles from './LoginPage.module.css';

interface LoginPageProps {
  onLogin: (secret: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [secret, setSecret] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const envSecret = import.meta.env.VITE_ADMIN_SECRET || 'daisy-admin-2026';
    
    if (secret.trim() === envSecret) {
      onLogin(secret.trim());
    } else {
      setError('Access denied! Invalid Admin Secret.');
      setTimeout(() => setError(null), 4000);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoContainer}>
          <span className={styles.logoEmoji}>🌼</span>
          <h1 className={styles.logoText}>Daisy Admin</h1>
        </div>
        <p className={styles.subtitle}>Enter Admin Secret Key to access the control panel.</p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="secret" className={styles.label}>Admin Secret Key</label>
            <input
              type="password"
              id="secret"
              className={styles.input}
              placeholder="••••••••••••"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className={styles.button}>
            Verify Secret Key
          </button>
        </form>

        {error && (
          <div className={styles.errorBanner}>
            <span>⚠️</span> {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
