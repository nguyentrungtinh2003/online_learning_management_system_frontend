import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Nhập file JSON chứa bản dịch
import enSettings from "./locales/en/settings.json";
import viSettings from "./locales/vi/settings.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "vi"],
    debug: true, // bật để xem console log
    ns: ["settings"],
    defaultNS: "settings",
    resources: {
      en: { settings: enSettings },
      vi: { settings: viSettings },
    },
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
