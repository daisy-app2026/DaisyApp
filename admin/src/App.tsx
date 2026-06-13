import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const secret = sessionStorage.getItem('adminSecret');
    if (secret) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (secret: string) => {
    sessionStorage.setItem('adminSecret', secret);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminSecret');
    setIsLoggedIn(false);
  };

  return isLoggedIn ? (
    <DashboardPage onLogout={handleLogout} />
  ) : (
    <LoginPage onLogin={handleLogin} />
  );
};

export default App;
