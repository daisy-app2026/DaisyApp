import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import Users from '../components/Users';
import Notifications from '../components/Notifications';
import Analytics from '../components/Analytics';
import Config from '../components/Config';
import styles from './DashboardPage.module.css';

interface DashboardPageProps {
  onLogout: () => void;
}

export type TabType = 'stats' | 'users' | 'notifications' | 'analytics' | 'config';

const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabType>('stats');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'stats':
        return <Dashboard />;
      case 'users':
        return <Users />;
      case 'notifications':
        return <Notifications />;
      case 'analytics':
        return <Analytics />;
      case 'config':
        return <Config />;
      default:
        return <Dashboard />;
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'stats':
        return 'System Overview';
      case 'users':
        return 'User Directory';
      case 'notifications':
        return 'Broadcast Notifications';
      case 'analytics':
        return 'Usage Analytics';
      case 'config':
        return 'App Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className={styles.layout}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className={styles.mainContent}>
        <Header title={getTabTitle()} onLogout={onLogout} />
        <div className={styles.scrollContainer}>
          <main className={styles.content}>
            {renderActiveComponent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
