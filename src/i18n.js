import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Nhập tất cả các bản dịch
import enSettings from "./locales/en/settings.json";
import viSettings from "./locales/vi/settings.json";

import enNavbar from "./locales/en/navbar.json";
import viNavbar from "./locales/vi/navbar.json";

import enSidebar from "./locales/en/sidebar.json";
import viSidebar from "./locales/vi/sidebar.json";

import enBlog from "./locales/en/blog.json";
import viBlog from "./locales/vi/blog.json";

import enRanking from "./locales/en/ranking.json";
import viRanking from "./locales/vi/ranking.json";

import enProfile from "./locales/en/profile.json";
import viProfile from "./locales/vi/profile.json";

import enPayment from "./locales/en/payment.json";
import viPayment from "./locales/vi/payment.json";

import enChatroom from "./locales/en/chatroom.json";
import viChatroom from "./locales/vi/chatroom.json";

import enDashboard from "./locales/en/dashboard.json";
import viDashboard from "./locales/vi/dashboard.json";

import enAdminManagement from "./locales/en/adminmanagement.json";
import viAdminManagement from "./locales/vi/adminmanagement.json";

import enAdminSetting from "./locales/en/adminsetting.json";
import viAdminSetting from "./locales/vi/adminsetting.json";

import enHomePage from "./locales/en/homepage.json";
import viHomePage from "./locales/vi/homepage.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "vi"],
    debug: true,
    ns: ["settings", "navbar", "sidebar", "blog", "ranking",
       "profile", "payment","chatroom","dashboard","adminmanagement",
      "adminsetting","homepage",],// thêm 'ranking'
    defaultNS: "settings",
    resources: {
      en: {
        settings: enSettings,
        navbar: enNavbar,
        sidebar: enSidebar,
        blog: enBlog,
        ranking: enRanking,
        profile: enProfile,
        payment: enPayment,
        chatroom: enChatroom,
        dashboard: enDashboard,
        adminmanagement: enAdminManagement,
        adminsetting: enAdminSetting,
        homepage: enHomePage,
      },
      vi: {
        settings: viSettings,
        navbar: viNavbar,
        sidebar: viSidebar,
        blog: viBlog,
        ranking: viRanking,
        profile: viProfile,
        payment: viPayment,
        chatroom: viChatroom,
        dashboard: viDashboard,
        adminmanagement: viAdminManagement,
        adminsetting: viAdminSetting,
        homepage: viHomePage,
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
