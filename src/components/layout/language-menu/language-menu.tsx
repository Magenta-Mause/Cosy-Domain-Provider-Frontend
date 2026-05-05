import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useLanguageChange } from "@/hooks/useLanguageChange/useLanguageChange";
import { cn } from "@/lib/utils.ts";
import { useLanguageMenuLogic } from "./useLanguageMenuLogic";

type LanguageMenuProps = {
  readonly buttonVariant?: ButtonProps["variant"];
  readonly className?: ButtonProps["className"];
  readonly style?: ButtonProps["style"];
};

export function LanguageMenu({
  buttonVariant,
  className,
  style,
}: LanguageMenuProps) {
  const { t, i18n } = useTranslation();
  const { handleLanguageChange: onChangeLanguage } = useLanguageChange();
  const { menuOpen, setMenuOpen, menuRef, languageCode, handleLanguageChange } =
    useLanguageMenuLogic(onChangeLanguage, i18n.language);

  return (
    <div ref={menuRef} className="relative">
      <Button
        type="button"
        data-testid="language-menu-toggle-btn"
        variant={buttonVariant}
        size="sm"
        className={cn("gap-1.5", className)}
        onClick={() => setMenuOpen((open) => !open)}
        title={t("language.label")}
        style={style}
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
