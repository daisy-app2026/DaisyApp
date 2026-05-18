import { create } from 'zustand';
import { TalkToPastSession } from '../services/talkToPastService';

interface TalkToPastState {
  sessions: TalkToPastSession[];
  isLoaded: boolean;
  pendingMessages: Record<string, boolean>;
  setPending: (sessionId: string, isPending: boolean) => void;
  setSessions: (sessions: TalkToPastSession[]) => void;
  updateSession: (session: TalkToPastSession) => void;
  deleteSession: (sessionId: string) => void;
  addSession: (session: TalkToPastSession) => void;
  invalidateCache: () => void;
}

export const useTalkToPastStore = create<TalkToPastState>((set) => ({
  sessions: [],
  isLoaded: false,
  pendingMessages: {},

  setPending: (sessionId, isPending) =>
    set((state) => ({
      pendingMessages: {
        ...state.pendingMessages,
        [sessionId]: isPending,
      },
    })),

  setSessions: (sessions) =>
    set({
      sessions: [...sessions].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ),
      isLoaded: true,
    }),

  updateSession: (updatedSession) =>
    set((state) => {
      // Only update if session exists
      const exists = state.sessions.find(
        (s) => s.id === updatedSession.id
      );
      if (!exists) return state;

      return {
        sessions: state.sessions
          .map((s) =>
            s.id === updatedSession.id
              ? updatedSession
              : s
          )
          .sort((a, b) =>
            new Date(b.updatedAt).getTime() -
            new Date(a.updatedAt).getTime()
          ),
      };
    }),

  addSession: (session) =>
    set((state) => ({
      sessions: [session, ...state.sessions].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ),
    })),

  deleteSession: (sessionId) =>
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== sessionId),
    })),

  invalidateCache: () =>
    set({ sessions: [], isLoaded: false, pendingMessages: {} }),
}));
