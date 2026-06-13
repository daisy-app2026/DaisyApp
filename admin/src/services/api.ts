import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to attach x-admin-secret dynamically from sessionStorage
api.interceptors.request.use(
  (config) => {
    const secret = sessionStorage.getItem('adminSecret') || '';
    config.headers['x-admin-secret'] = secret;
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getStats = () => 
  api.get('/api/admin/stats');

export const getUsers = () => 
  api.get('/api/admin/users');

export const deleteUser = (uid: string) => 
  api.delete(`/api/admin/users/${uid}`);

export const getAnalytics = () => 
  api.get('/api/admin/analytics');

export const getConfig = () => 
  api.get('/api/admin/config');

export const sendNotification = (title: string, body: string) => 
  api.post('/api/admin/notifications/send', { title, body });

export const updateConfig = (privacyPolicyUrl: string, termsOfServiceUrl: string) => 
  api.put('/api/admin/config', { privacyPolicyUrl, termsOfServiceUrl });

export default api;
