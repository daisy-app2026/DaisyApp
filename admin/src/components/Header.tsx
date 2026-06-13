import React from 'react';
import { LogOut } from 'lucide-react';
import styles from './Header.module.css';

interface HeaderProps {
  title: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onLogout }) => {
  return (
    <header className={styles.header}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>{title}</h2>
      </div>

      <div className={styles.actions}>
        <div className={styles.statusBadge}>
          <span className={styles.statusDot}></span>
          <span className={styles.statusText}>System Online</span>
        </div>

        <button onClick={onLogout} className={styles.logoutButton}>
          <LogOut size={16} className={styles.logoutIcon} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
