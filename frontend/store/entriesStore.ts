import { create } from 'zustand'
import { Entry } from '../services/entryService'

interface EntriesState {
  recentEntries: Entry[]
  allEntries: Entry[]
  entriesBySpace: Record<string, Entry[]>
  isRecentLoaded: boolean
  isAllLoaded: boolean
  
  setRecentEntries: (entries: Entry[]) => void
  setAllEntries: (entries: Entry[]) => void
  setEntriesBySpace: (
    spaceId: string, 
    entries: Entry[]
  ) => void
  invalidateCache: () => void
  invalidateSpaceCache: (spaceId: string) => void
}

export const useEntriesStore = create<EntriesState>(
  (set) => ({
    recentEntries: [],
    allEntries: [],
    entriesBySpace: {},
    isRecentLoaded: false,
    isAllLoaded: false,

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
      }),

    invalidateSpaceCache: (spaceId) =>
      set((state) => {
        const updated = { 
          ...state.entriesBySpace 
        }
        delete updated[spaceId]
        return { entriesBySpace: updated }
      }),
  })
)
