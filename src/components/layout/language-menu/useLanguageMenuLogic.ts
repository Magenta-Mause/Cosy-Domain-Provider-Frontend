import { useDropdown } from "@/hooks/useDropdown/useDropdown";
import type { AppLanguage } from "@/i18n/resources";
import { getLanguageCode } from "./lib";

export function useLanguageMenuLogic(
  onChangeLanguage: (language: AppLanguage) => Promise<void> | void,
  currentLanguage: string,
) {
  const {
    isOpen: menuOpen,
    setIsOpen: setMenuOpen,
    ref: menuRef,
  } = useDropdown();

  const languageCode = getLanguageCode(currentLanguage);

  async function handleLanguageChange(language: AppLanguage) {
    await onChangeLanguage(language);
    setMenuOpen(false);
  }

  return { menuOpen, setMenuOpen, menuRef, languageCode, handleLanguageChange };
}
