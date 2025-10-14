import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import { LocalStorageService } from '@/services';

// Get saved language from localStorage or default to Vietnamese
const getDefaultLanguage = (): string => {
  if (typeof window === 'undefined') return 'vi';
  const savedLanguage = LocalStorageService.get('APP_LANGUAGE') as string;
  return savedLanguage || 'vi'; // Default to Vietnamese
};

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: getDefaultLanguage(),
    fallbackLng: 'vi', // Fallback to Vietnamese
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;

