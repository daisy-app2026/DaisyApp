import React, { useState } from 'react';
import { sendNotification } from '../services/api';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import styles from './Notifications.module.css';

const Notifications: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setErrorMsg('Title and Message body are required!');
      return;
    }

    try {
      setLoading(true);
      setSuccessMsg(null);
      setErrorMsg(null);

      const res = await sendNotification(title.trim(), body.trim());
      
      if (res.data.success) {
        setSuccessMsg('Broadcast push notification sent successfully to all users!');
        setTitle('');
        setBody('');
      } else {
        setErrorMsg('Failed to broadcast. Server responded with an error.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to send notifications. Verify admin credentials and network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.heading}>Broadcast Notifications</h1>
        <p className={styles.subtext}>Send global push notification announcements to all registered users.</p>
      </div>

      <div className={styles.card}>
        <form onSubmit={handleSend} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="title" className={styles.label}>Notification Title</label>
            <input
              type="text"
              id="title"
              className={styles.input}
              placeholder="e.g. New Feature Alert!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="body" className={styles.label}>Message Body</label>
            <textarea
              id="body"
              className={styles.textarea}
              placeholder="Write your push notification message body here..."
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={loading}
              required
            />
            <p className={styles.tip}>Keep it short and engaging (under 150 characters is recommended).</p>
          </div>

          <button
            type="submit"
            className={styles.sendButton}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                Broadcasting Notification...
              </>
            ) : (
              'Send to All Users'
            )}
          </button>
        </form>

        {successMsg && (
          <div className={styles.successBanner}>
            <CheckCircle size={18} className={styles.bannerIcon} />
            <p className={styles.bannerText}>{successMsg}</p>
          </div>
        )}

        {errorMsg && (
          <div className={styles.errorBanner}>
            <AlertTriangle size={18} className={styles.bannerIcon} />
            <p className={styles.bannerText}>{errorMsg}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
