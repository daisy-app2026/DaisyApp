import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyB1OlF3wkD-4qgIg37bwfJf74ac5oUfsPA',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'daisy-app-82b09.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'daisy-app-82b09',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'daisy-app-82b09.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '173246095861',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:173246095861:web:aebf63b6d9fcc9fcae40bc',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
