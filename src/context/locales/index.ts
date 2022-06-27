import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import { LANGUAGE_DEFAULT } from '@helpers/constants';
import enLang from './en';
import vnLang from './vn';

export type LangDataTypes = Partial<typeof vnLang>;

i18n
  .use({
    type: 'languageDetector',
    detect: () => {
      const [{ languageCode }] = getLocales();
      return languageCode;
    },
    init: Function.prototype,
    cacheUserLanguage: Function.prototype,
  })
  .use(initReactI18next)
  .init({
    defaultNS: 'translation',
    fallbackLng: LANGUAGE_DEFAULT,
    debug: false,
    interpolation: {
      escapeValue: true,
    },
    keySeparator: false,
    resources: {
      en: enLang,
      vi: vnLang,
    },
    lng: LANGUAGE_DEFAULT,
  });

export { i18n };
