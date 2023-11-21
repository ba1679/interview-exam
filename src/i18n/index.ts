import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import backend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(detector)
  .use(backend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['navigator', 'cookie'],
    },
    react: {
      useSuspense: false,
    },
    backend: {
      loadPath: '/interview-exam/locales/{{lng}}/translation.json',
    },
  });

export default i18n;
