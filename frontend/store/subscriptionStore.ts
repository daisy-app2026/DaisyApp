import { create } from 'zustand'

export type Plan = 'free' | 'basic' | 'pro'

interface SubscriptionState {
  plan: Plan
  messageLimit: number
  monthlyMessageCount: number
  chatLimit: number
  chatCount: number
  messageResetAt: string | null
  isLoading: boolean
  setSubscriptionData: (data: Partial<SubscriptionState>) => void
  setPlan: (plan: Plan) => void
  setLoading: (loading: boolean) => void
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  plan: 'free',
  messageLimit: 30,
  monthlyMessageCount: 0,
  chatLimit: 3,
  chatCount: 0,
  messageResetAt: null,
  isLoading: false,
  setSubscriptionData: (data) => set((state) => ({ ...state, ...data })),
  setPlan: (plan) => set({ plan }),
  setLoading: (isLoading) => set({ isLoading }),
}))
