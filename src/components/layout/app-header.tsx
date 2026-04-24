import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { CosyLogo } from "@/components/layout/cosy-logo";
import { LanguageMenu } from "@/components/layout/language-menu";
import { UserMenu } from "@/components/layout/user-menu";

import { useAppHeaderLogic } from "./useAppHeaderLogic";

export function AppHeader() {
  const { t } = useTranslation();
  const {
    userName,
    isUserLoggedIn,
    isLoggingOut,
    handleLanguageChange,
    handleLogout,
    handleDelete,
  } = useAppHeaderLogic();

  return (
    <header className="px-7 py-4 flex items-center gap-4 relative z-[5]">
      <CosyLogo linkTo="/dashboard" testId="header-logo-link" />
      <div className="flex-1" />

      <LanguageMenu onChangeLanguage={handleLanguageChange} />

      {isUserLoggedIn ? (
        <UserMenu
          userName={userName}
          isLoggingOut={isLoggingOut}
          onLogout={handleLogout}
          onDelete={handleDelete}
        />
      ) : (
        <Link
          to="/login"
          data-testid="header-login-link"
          className="pbtn sm secondary"
        >
          {t("nav.login")}
        </Link>
      )}
    </header>
  );
}
