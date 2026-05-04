import { useTranslation } from "react-i18next";
import type { AppLanguage } from "@/i18n/resources";

export function useLanguageChange() {
  const { i18n } = useTranslation();

  async function handleLanguageChange(language: AppLanguage) {
    await i18n.changeLanguage(language);
    if (typeof window !== "undefined") {
      globalThis.localStorage.setItem("cosy-language", language);
    }
  }

  return { handleLanguageChange };
}
