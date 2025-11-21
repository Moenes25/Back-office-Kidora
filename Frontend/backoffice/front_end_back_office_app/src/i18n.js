import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "fr",
    debug: false,

    interpolation: {
      escapeValue: false,
    },

    resources: {
      fr: {
        translation: {
          dashboard: "Tableau de bord",
          creches: "Crèches",
          ia: "Analyse IA",
          paiements: "Paiements & Licences",
          support: "Support",
          settings: "Paramètres",
          search: "Rechercher...",
          profile: "Profil",
          logout: "Déconnexion",
        },
      },

      en: {
        translation: {
          dashboard: "Dashboard",
          creches: "Daycare Centers",
          ia: "AI Analysis",
          paiements: "Payments & Licenses",
          support: "Support",
          settings: "Settings",
          search: "Search...",
          profile: "Profile",
          logout: "Logout",
        },
      },

      ar: {
        translation: {
          dashboard: "لوحة التحكم",
          creches: "دور الحضانة",
          ia: "تحليل الذكاء الاصطناعي",
          paiements: "الدفع والتراخيص",
          support: "الدعم",
          settings: "الإعدادات",
          search: "بحث...",
          profile: "الملف الشخصي",
          logout: "تسجيل الخروج",
        },
      },
    },
  });

export default i18n;
