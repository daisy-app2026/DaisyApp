import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { en, type Translations } from '../locales/en';
import { de } from '../locales/de';
import { fr } from '../locales/fr';
import { ar } from '../locales/ar';

export type Language = 'en' | 'de' | 'fr' | 'ar';

export interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
];

const dictionaries: Record<Language, Translations> = {
  en,
  de,
  fr,
  ar,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'ltr' | 'rtl';
  t: (path: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('daisy_landing_lang') as Language;
    if (saved && ['en', 'de', 'fr', 'ar'].includes(saved)) {
      return saved;
    }
    // Check browser language
    const browserLang = navigator.language.slice(0, 2).toLowerCase();
    if (browserLang === 'de') return 'de';
    if (browserLang === 'fr') return 'fr';
    if (browserLang === 'ar') return 'ar';
    return 'en';
  });

  const activeOption = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
  const dir = activeOption.dir;

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    localStorage.setItem('daisy_landing_lang', language);
  }, [language, dir]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (path: string): any => {
    const keys = path.split('.');
    let current: any = dictionaries[language] || dictionaries.en;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to English if translation key is missing
        let fallback: any = dictionaries.en;
        for (const k of keys) {
          if (fallback && typeof fallback === 'object' && k in fallback) {
            fallback = fallback[k];
          } else {
            return path;
          }
        }
        return fallback;
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
