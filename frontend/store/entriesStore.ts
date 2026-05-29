/**
 * Entries Store
 * Manages the state of recent entries, all entries, and entry statistics.
 * Supports caching and background synchronization.
 */
import { create } from 'zustand'
import { Entry } from '../services/entryService'

export interface Stats {
  totalEntries: number
  totalCapsules: number
  currentStreak: number
}

interface EntriesState {
  recentEntries: Entry[]
  allEntries: Entry[]
  entriesBySpace: Record<string, Entry[]>
  isRecentLoaded: boolean
  isAllLoaded: boolean
  stats: Stats | null
  isStatsLoaded: boolean
  
  setRecentEntries: (entries: Entry[]) => void
  setAllEntries: (entries: Entry[]) => void
  setEntriesBySpace: (
    spaceId: string, 
    entries: Entry[]
  ) => void
  invalidateCache: () => void
  invalidateSpaceCache: (spaceId: string) => void
  updateEntryInCache: (updatedEntry: Entry) => void
  setStats: (stats: Stats) => void
}

export const useEntriesStore = create<EntriesState>(
  (set) => ({
    recentEntries: [],
    allEntries: [],
    entriesBySpace: {},
    isRecentLoaded: false,
    isAllLoaded: false,
    stats: null,
    isStatsLoaded: false,

    setRecentEntries: (entries) =>
      set({ 
        recentEntries: entries,
        isRecentLoaded: true 
      }),

    setAllEntries: (entries) =>
      set({ 
        allEntries: entries,
        isAllLoaded: true 
      }),

    setEntriesBySpace: (spaceId, entries) =>
      set((state) => ({
        entriesBySpace: {
          ...state.entriesBySpace,
          [spaceId]: entries
        }
      })),

    invalidateCache: () =>
      set({
        recentEntries: [],
        allEntries: [],
        entriesBySpace: {},
        isRecentLoaded: false,
        isAllLoaded: false,
        stats: null,
        isStatsLoaded: false,
      }),

    invalidateSpaceCache: (spaceId) =>
      set((state) => {
        const updated = { 
          ...state.entriesBySpace 
        }
        delete updated[spaceId]
        return { entriesBySpace: updated }
      }),

    updateEntryInCache: (updatedEntry) =>
      set(state => ({
        recentEntries: state.recentEntries
          .map(e => 
            e.id === updatedEntry.id 
              ? updatedEntry 
              : e
          ),
        allEntries: state.allEntries
          .map(e =>
            e.id === updatedEntry.id
              ? updatedEntry
              : e
          ),
        entriesBySpace: Object.fromEntries(
          Object.entries(state.entriesBySpace)
            .map(([spaceId, entries]) => [
              spaceId,
              entries.map(e =>
                e.id === updatedEntry.id
                  ? updatedEntry
                  : e
              )
            ])
        )
      })),

    setStats: (stats) =>
      set({ 
        stats, 
        isStatsLoaded: true 
      }),
  })
)
