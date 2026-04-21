import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import cosyLogo from "@/assets/cosy-logo.webp";
import { LanguageMenu } from "@/components/layout/language-menu";
import { UserMenu } from "@/components/layout/user-menu";
import useAuthInformation from "@/hooks/useAuthInformation/useAuthInformation";
import type { AppLanguage } from "@/i18n/resources";

export function AppHeader() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { logoutUser, userName, isUserLoggedIn } = useAuthInformation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          textDecoration: "none",
        }}
      >
        <img
          src={cosyLogo}
          alt="Cosy logo"
          style={{ width: 36, height: 36, objectFit: "contain" }}
        />
        <div style={{ textAlign: "left" }}>
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
            {t("appTagline")}
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
        <Link to="/login" className="pbtn sm secondary">
          {t("nav.login")}
        </Link>
      )}
    </header>
  );
}
