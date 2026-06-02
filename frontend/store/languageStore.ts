import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import en from '../locales/en.json'
import de from '../locales/de.json'
import ar from '../locales/ar.json'

export type Language = 'en' | 'de' | 'ar'

interface LanguageStore {
  language: Language
  t: typeof en
  setLanguage: (lang: Language) => void
}

const getTranslations = (lang: Language) => {
  switch (lang) {
    case 'de':
      return de
    case 'ar':
      return ar
    default:
      return en
  }
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: 'en',
  t: en,
  setLanguage: (lang) => {
    AsyncStorage.setItem('daisy_language', lang).catch((err) =>
      console.log('Error saving language:', err)
    )
    set({
      language: lang,
      t: getTranslations(lang),
    })
  },
}))

export const initLanguageStore = async () => {
  try {
    const savedLang = await AsyncStorage.getItem('daisy_language')
    if (savedLang && ['en', 'de', 'ar'].includes(savedLang)) {
      useLanguageStore.getState().setLanguage(savedLang as Language)
    }
  } catch (error) {
    console.log('Error initializing language store:', error)
  }
}
