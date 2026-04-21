import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { defaultNS, resources, type AppLanguage } from "@/i18n/resources";

const LANGUAGE_STORAGE_KEY = "cosy-language";
const storedLanguage =
  typeof window !== "undefined"
    ? (window.localStorage.getItem(LANGUAGE_STORAGE_KEY) as AppLanguage | null)
    : null;
const initialLanguage: AppLanguage =
  storedLanguage && storedLanguage in resources ? storedLanguage : "en";

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: "en",
  defaultNS,
  interpolation: {
    escapeValue: false,
  },
});

export { i18n };
