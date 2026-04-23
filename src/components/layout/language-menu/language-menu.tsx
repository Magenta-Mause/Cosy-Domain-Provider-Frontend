import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import type { AppLanguage } from "@/i18n/resources";
import { useLanguageMenuLogic } from "./useLanguageMenuLogic";

type LanguageMenuProps = {
  onChangeLanguage: (language: AppLanguage) => Promise<void> | void;
};

export function LanguageMenu({ onChangeLanguage }: LanguageMenuProps) {
  const { t, i18n } = useTranslation();
  const { menuOpen, setMenuOpen, menuRef, languageCode, handleLanguageChange } =
    useLanguageMenuLogic(onChangeLanguage, i18n.language);

  return (
    <div ref={menuRef} className="relative">
      <Button
        type="button"
        data-testid="language-menu-toggle-btn"
        size="sm"
        className="gap-1.5"
        onClick={() => setMenuOpen((open) => !open)}
        title={t("language.label")}
      >
        <Languages size={14} />
        {languageCode}
      </Button>
      {menuOpen ? (
        <div
          role="menu"
          aria-label={t("language.label")}
          className="absolute grid gap-1.5 p-2 z-[35] top-[calc(100%+8px)] right-0 min-w-[180px] bg-btn-secondary border-2 border-foreground rounded-radius-sm"
          style={{ boxShadow: "4px 4px 0 0 var(--foreground)" }}
        >
          <Button
            type="button"
            data-testid="language-menu-en-btn"
            variant="ghost"
            size="sm"
            className="justify-start"
            onClick={() => {
              void handleLanguageChange("en");
            }}
          >
            {t("language.en")}
          </Button>
          <Button
            type="button"
            data-testid="language-menu-de-btn"
            variant="ghost"
            size="sm"
            className="justify-start"
            onClick={() => {
              void handleLanguageChange("de");
            }}
          >
            {t("language.de")}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
