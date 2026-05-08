import { create } from 'zustand'

interface Space {
  id: string
  name: string
  icon: string
  iconBg: string
  iconBgLight: string
  isDefault: boolean
}

interface SpacesState {
  spaces: Space[]
  isLoaded: boolean
  setSpaces: (spaces: Space[]) => void
  addSpace: (space: Space) => void
  removeSpace: (spaceId: string) => void
  invalidateCache: () => void
}

export const useSpacesStore = 
  create<SpacesState>((set) => ({
    spaces: [],
    isLoaded: false,

    setSpaces: (spaces) =>
      set({ spaces, isLoaded: true }),

    addSpace: (space) =>
      set((state) => ({
        spaces: [...state.spaces, space]
      })),

    removeSpace: (spaceId) =>
      set((state) => ({
        spaces: state.spaces.filter(
          s => s.id !== spaceId
        )
      })),

    invalidateCache: () =>
      set({ spaces: [], isLoaded: false }),
  }))
