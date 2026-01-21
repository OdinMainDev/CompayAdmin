import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import translationEN from '@/assets/locales/en/translation.json';
import translationRU from '@/assets/locales/ru/translation.json';
import landingEN from '@/assets/locales/en/landing.json';
import landingRU from '@/assets/locales/ru/landing.json';
import panelEN from '@/assets/locales/en/panel.json';
import panelRU from '@/assets/locales/ru/panel.json';
import menuEN from '@/assets/locales/en/menu.json';
import menuRU from '@/assets/locales/ru/menu.json';
import { I18N_DEFAULT_LANGUAGE, I18N_LANGUAGES, I18N_STORAGE_KEY } from './constants';

const getInitialLanguage = () => {
  if (typeof window === 'undefined') return I18N_DEFAULT_LANGUAGE

  const stored = window.localStorage.getItem(I18N_STORAGE_KEY)
  if (stored && I18N_LANGUAGES.includes(stored as (typeof I18N_LANGUAGES)[number])) {
    return stored
  }

  const browser = window.navigator.language.split('-')[0]
  if (browser && I18N_LANGUAGES.includes(browser as (typeof I18N_LANGUAGES)[number])) {
    return browser
  }

  return I18N_DEFAULT_LANGUAGE
}

export const changeLanguage = (lng: string) => {
  if (!I18N_LANGUAGES.includes(lng as (typeof I18N_LANGUAGES)[number])) {
    return;
  }
  i18n.changeLanguage(lng)
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(I18N_STORAGE_KEY, lng);
};

const resources = {
  en: { translation: translationEN, landing: landingEN, panel: panelEN, menu: menuEN },
  ru: { translation: translationRU, landing: landingRU, panel: panelRU, menu: menuRU },
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: I18N_DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
})

export default i18n
