
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en_US from './en-US.json';
import zh_CN from './zh-CN.json';
import ms from "./ms.json";
import ta from "./ta.json";
  
i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: 'en-US',
    fallbackLng: 'en-US',
    resources: {
        "en-US": en_US,
        "zh-CN": zh_CN,
        "ms": ms,
        "ta": ta
    },
    interpolation: {
        escapeValue: false
    }
});

export default i18n;