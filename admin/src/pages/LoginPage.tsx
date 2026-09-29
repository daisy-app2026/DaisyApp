import React, { useState } from 'react';
import { Leaf, AlertTriangle } from 'lucide-react';
import styles from './LoginPage.module.css';

interface LoginPageProps {
  onLogin: (secret: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [secret, setSecret] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: secret.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.token) {
        localStorage.setItem('adminToken', data.token);
        onLogin(data.token);
      } else {
        setError(data.error || 'Invalid password');
        setTimeout(() => setError(null), 4000);
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      setTimeout(() => setError(null), 4000);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoContainer}>
          <Leaf size={40} className={styles.logoIcon} />
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
            <AlertTriangle size={18} className={styles.errorIcon} /> {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
