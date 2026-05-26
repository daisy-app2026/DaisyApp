import { create } from 'zustand';
import { TalkToCrushSession } from '../services/talkToCrushService';

interface TalkToCrushState {
  sessions: TalkToCrushSession[];
  isLoaded: boolean;
  pendingMessages: Record<string, boolean>;
  setPending: (sessionId: string, isPending: boolean) => void;
  setSessions: (sessions: TalkToCrushSession[]) => void;
  updateSession: (session: TalkToCrushSession) => void;
  deleteSession: (sessionId: string) => void;
  addSession: (session: TalkToCrushSession) => void;
  invalidateCache: () => void;
}

export const useTalkToCrushStore = create<TalkToCrushState>((set) => ({
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
