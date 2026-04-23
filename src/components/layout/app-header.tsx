import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CosyLogo } from "@/components/layout/cosy-logo";
import { LanguageMenu } from "@/components/layout/language-menu";
import { UserMenu } from "@/components/layout/user-menu";
import { useLanguageChange } from "@/hooks/useLanguageChange/useLanguageChange";
import useAuthInformation from "@/hooks/useAuthInformation/useAuthInformation";

export function AppHeader() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logoutUser, userName, isUserLoggedIn, deleteUser } = useAuthInformation();
  const { handleLanguageChange } = useLanguageChange();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <header className="px-7 py-4 flex items-center gap-4 relative z-[5]">
      <CosyLogo linkTo="/dashboard" testId="header-logo-link" />
      <div className="flex-1" />

      <LanguageMenu onChangeLanguage={handleLanguageChange} />

      {isUserLoggedIn ? (
        <UserMenu
          userName={userName}
          isLoggingOut={isLoggingOut}
          onLogout={async () => {
            setIsLoggingOut(true);
            try {
              await logoutUser();
              await navigate({ to: "/login" });
            } finally {
              setIsLoggingOut(false);
            }
          }}
          onDelete={async () => {
            if (confirm(t("nav.userDeletionConfirm"))) {
              await deleteUser();
            }
          }}
        />
      ) : (
        <Link to="/login" data-testid="header-login-link" className="pbtn sm secondary">
          {t("nav.login")}
        </Link>
      )}
    </header>
  );
}
