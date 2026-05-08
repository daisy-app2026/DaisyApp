import { create } from 'zustand';

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
    setUser: (user) =>
      set({
        user,
        isAuthenticated: user !== null,
      }),
    setLoading: (isLoading) => set({ isLoading }),
    logout: () =>
      set({
        user: null,
        isAuthenticated: false,
      }),
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
