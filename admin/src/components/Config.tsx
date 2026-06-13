import React, { useState, useEffect } from 'react';
import { getConfig, updateConfig } from '../services/api';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import styles from './Config.module.css';

const Config: React.FC = () => {
  const [privacyPolicyUrl, setPrivacyPolicyUrl] = useState<string>('');
  const [termsOfServiceUrl, setTermsOfServiceUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await getConfig();
      setPrivacyPolicyUrl(res.data.privacyPolicyUrl || '');
      setTermsOfServiceUrl(res.data.termsOfServiceUrl || '');
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load active application configuration. Check backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyPolicyUrl.trim() || !termsOfServiceUrl.trim()) {
      setError('Both URL fields are required!');
      return;
    }

    try {
      setSaving(true);
      setSuccess(null);
      setError(null);

      const res = await updateConfig(privacyPolicyUrl.trim(), termsOfServiceUrl.trim());

      if (res.data.success) {
        setSuccess('Application settings updated successfully!');
        setPrivacyPolicyUrl(res.data.config.privacyPolicyUrl);
        setTermsOfServiceUrl(res.data.config.termsOfServiceUrl);
      } else {
        setError('Failed to save settings. Server error.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to update config. Verify admin credentials and connectivity.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading app configuration...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.heading}>App Configuration</h1>
        <p className={styles.subtext}>Update terms of service and privacy policy URLs for users dynamically.</p>
      </div>

      <div className={styles.card}>
        {error && !saving && (
          <div className={styles.errorBanner}>
            <AlertTriangle size={18} className={styles.bannerIcon} />
            <p className={styles.bannerText}>{error}</p>
          </div>
        )}

        {success && (
          <div className={styles.successBanner}>
            <CheckCircle size={18} className={styles.bannerIcon} />
            <p className={styles.bannerText}>{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="privacyPolicy" className={styles.label}>Privacy Policy URL</label>
            <input
              type="url"
              id="privacyPolicy"
              className={styles.input}
              placeholder="https://example.com/privacy"
              value={privacyPolicyUrl}
              onChange={(e) => setPrivacyPolicyUrl(e.target.value)}
              disabled={saving}
              required
            />
            <p className={styles.inputTip}>Must be a valid URL starting with http:// or https://</p>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="termsOfService" className={styles.label}>Terms of Service URL</label>
            <input
              type="url"
              id="termsOfService"
              className={styles.input}
              placeholder="https://example.com/terms"
              value={termsOfServiceUrl}
              onChange={(e) => setTermsOfServiceUrl(e.target.value)}
              disabled={saving}
              required
            />
            <p className={styles.inputTip}>Must be a valid URL starting with http:// or https://</p>
          </div>

          <button
            type="submit"
            className={styles.saveButton}
            disabled={saving}
          >
            {saving ? (
              <>
                <span className={styles.spinnerSmall}></span>
                Saving Settings...
              </>
            ) : (
              'Save Configuration'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Config;
