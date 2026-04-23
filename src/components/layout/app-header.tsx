import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import cosyIcon from "@/assets/cosy-logo.webp";
import { LanguageMenu } from "@/components/layout/language-menu";
import { UserMenu } from "@/components/layout/user-menu";
import useAuthInformation from "@/hooks/useAuthInformation/useAuthInformation";
import type { AppLanguage } from "@/i18n/resources";

export function AppHeader() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { logoutUser, userName, isUserLoggedIn, deleteUser } =
    useAuthInformation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLanguageChange(language: AppLanguage) {
    await i18n.changeLanguage(language);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("cosy-language", language);
    }
  }

  return (
    <header className="px-7 py-4 flex items-center gap-4 relative z-[5]">
      <Link
        to="/dashboard"
        data-testid="header-logo-link"
        className="flex items-center gap-2.5 no-underline! hover:no-underline"
      >
        <img src={cosyIcon} alt={"Cosy"} className={"h-12"} />
        <div className="text-left pt-[3px]">
          <div
            className="pixel text-base"
            style={{ color: "oklch(0.95 0.05 70)" }}
          >
            COSY
          </div>
          <div
            className="text-sm mt-0.5 opacity-[0.85]"
            style={{ color: "oklch(0.92 0.04 60)" }}
          >
            Domain Provider
          </div>
        </div>
      </Link>
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
