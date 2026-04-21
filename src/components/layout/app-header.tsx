import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
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
  const routerState = useRouterState();
  const { logoutUser, userName, isUserLoggedIn } = useAuthInformation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const currentPath = routerState.location.pathname;
  const isDashboard = currentPath === "/dashboard";

  async function handleLanguageChange(language: AppLanguage) {
    await i18n.changeLanguage(language);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("cosy-language", language);
    }
  }

  return (
    <header
      style={{
        padding: "16px 28px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        position: "relative",
        zIndex: 5,
      }}
    >
      <Link
        to="/dashboard"
        data-testid="header-logo-link"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          textDecoration: "none",
        }}
      >
        <img src={cosyIcon} alt={"Cosy"} className={"h-12"} />
        <div style={{ textAlign: "left", paddingTop: "3px" }}>
          <div
            className="pixel"
            style={{ fontSize: 16, color: "oklch(0.95 0.05 70)" }}
          >
            COSY
          </div>
          <div
            style={{
              fontSize: 14,
              marginTop: 2,
              color: "oklch(0.92 0.04 60)",
              opacity: 0.85,
            }}
          >
            Domain Provider
          </div>
        </div>
      </Link>
      <div style={{ flex: 1 }} />

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
