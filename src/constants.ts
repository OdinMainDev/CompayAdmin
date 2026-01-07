export const COOKIE_AUTH_NAME = 'cpauth';
export const COOKIE_AUTH_TOTP_NAME = 'cptotp';


// Languages
export const I18N_DEFAULT_LANGUAGE = 'ru' as const;
export const I18N_LANGUAGES = ['ru', 'en'] as const;
export type I18NLanguage = (typeof I18N_LANGUAGES)[number];
export const I18N_STORAGE_KEY = 'compay-admin-lang';