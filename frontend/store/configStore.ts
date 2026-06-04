import { create } from 'zustand'

interface ConfigStore {
  privacyPolicyUrl: string
  termsOfServiceUrl: string
  setConfig: (config: {
    privacyPolicyUrl: string
    termsOfServiceUrl: string
  }) => void
}

export const useConfigStore = create<ConfigStore>((set) => ({
  privacyPolicyUrl: '',
  termsOfServiceUrl: '',
  setConfig: (config) => set(config),
}))
