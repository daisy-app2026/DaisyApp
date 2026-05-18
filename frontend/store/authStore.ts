import { create } from 'zustand';
import { useEntriesStore } from './entriesStore';
import { useSpacesStore } from './spacesStore';
import { useTalkToPastStore } from './talkToPastStore';

interface User {
  uid: string;
  email: string | null;
  name: string | null;
  token: string;
  createdAt?: string;
  photoURL?: string | null;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  updateName: (name: string) => void;
  updatePhotoURL: (photoURL: string) => void;
}

export const useAuthStore = create<AuthState>(
  (set) => ({
    user: null,
    isLoading: false,
    isAuthenticated: false,
    setUser: (user) => {
      // Clear old cache first!
      useEntriesStore.getState().invalidateCache();
      useSpacesStore.getState().invalidateCache();

      set({
        user,
        isAuthenticated: user !== null,
        isLoading: false,
      });
    },
    setLoading: (isLoading) => set({ isLoading }),
    logout: () => {
      // Clear auth
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      // Clear entries cache
      useEntriesStore.getState().invalidateCache();

      // Clear spaces cache
      useSpacesStore.getState().invalidateCache();

      // Clear talk to past cache
      useTalkToPastStore.getState().invalidateCache();
    },
    updateName: (name) =>
      set((state) => ({
        user: state.user ? { ...state.user, name } : null,
      })),
    updatePhotoURL: (photoURL) =>
      set((state) => ({
        user: state.user ? { ...state.user, photoURL } : null,
      })),
  })
);
