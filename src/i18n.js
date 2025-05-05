import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Nhập tất cả các bản dịch
import enSettings from "./locales/en/settings.json";
import viSettings from "./locales/vi/settings.json";

import enNavbar from "./locales/en/navbar.json";
import viNavbar from "./locales/vi/navbar.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "vi"],
    debug: true,
    ns: ["settings", "navbar"], // danh sách namespace
    defaultNS: "settings",
    resources: {
      en: {
        settings: enSettings,
        navbar: enNavbar,
      },
      vi: {
        settings: viSettings,
        navbar: viNavbar,
      },
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
