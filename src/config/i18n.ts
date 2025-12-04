export const languages = ['ru', 'en'] as const;
export type LanguageCode = (typeof languages)[number];
export const defaultLanguage: LanguageCode = 'ru';
const STORAGE_KEY = 'compay-admin-lang';

export const getInitialLanguage = (): LanguageCode => {
  if (typeof window === 'undefined') {
    return defaultLanguage;
  }
  const cached = window.localStorage.getItem(STORAGE_KEY);
  if (cached && languages.includes(cached as LanguageCode)) {
    return cached as LanguageCode;
  }
  return defaultLanguage;
};

export const persistLanguage = (lng: LanguageCode) => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, lng);
};
