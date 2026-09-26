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

export const getServiceHealth = () =>
  api.get('/api/admin/service-health');

export const getPricing = () =>
  api.get('/api/admin/pricing');

export const updatePricing = (data: Record<string, unknown>) =>
  api.put('/api/admin/pricing', data);

export const getPricingPlans = () =>
  api.get('/api/admin/pricing');

export const updatePricingPlan = (planId: string, planData: Record<string, unknown>) =>
  api.put(`/api/admin/pricing/${planId}`, planData);

export const getSubscriptionStats = () =>
  api.get('/api/admin/subscription-stats');

export const clearAdminCache = () =>
  api.delete('/api/admin/cache');

export const getPlanLimits = () =>
  api.get('/api/admin/plans/limits');

export const updatePlanLimits = (data: Record<string, unknown>) =>
  api.put('/api/admin/plans/limits', data);

export default api;
