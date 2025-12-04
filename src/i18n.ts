import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './assets/locales/en/translation.json';
import translationRU from './assets/locales/ru/translation.json';
import landingEN from './assets/locales/en/landing.json';
import landingRU from './assets/locales/ru/landing.json';
import { defaultLanguage, getInitialLanguage } from './config/i18n';

const resources = {
  en: { translation: translationEN, landing: landingEN },
  ru: { translation: translationRU, landing: landingRU },
} as const;

void i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: defaultLanguage,
  ns: ['translation', 'landing'],
  defaultNS: 'translation',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
