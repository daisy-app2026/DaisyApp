import React from 'react';
import { TabType } from '../pages/DashboardPage';
import styles from './Sidebar.module.css';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'stats' as TabType, label: 'Dashboard', icon: '📊' },
    { id: 'users' as TabType, label: 'Users', icon: '👥' },
    { id: 'notifications' as TabType, label: 'Notifications', icon: '🔔' },
    { id: 'analytics' as TabType, label: 'Analytics', icon: '📈' },
    { id: 'config' as TabType, label: 'Config', icon: '⚙️' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <span className={styles.logoEmoji}>🌼</span>
        <span className={styles.logoText}>Daisy Admin</span>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className={styles.footer}>
        <p className={styles.version}>v1.0.0</p>
        <p className={styles.footerText}>Secure Admin Panel</p>
      </div>
    </aside>
  );
};

export default Sidebar;
