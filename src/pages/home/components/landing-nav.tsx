import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { CosyLogo } from "@/components/layout/cosy-logo";
import { LanguageMenu } from "@/components/layout/language-menu";
import { useLanguageChange } from "@/hooks/useLanguageChange/useLanguageChange";
import useAuthInformation from "@/hooks/useAuthInformation/useAuthInformation";

export function LandingNav() {
  const { t } = useTranslation();
  const { isUserLoggedIn } = useAuthInformation();
  const { handleLanguageChange } = useLanguageChange();

  return (
    <header className="flex items-center gap-4 relative z-[3] px-8 py-5">
      <CosyLogo testId="home-logo" />

      <div className="flex-1" />

      <nav className="flex gap-2 items-center">
        <a
          href="#features"
          data-testid="home-features-link"
          className="text-lg"
          style={{ color: "oklch(0.95 0.05 70)" }}
        >
          {t("landingNav.features")}
        </a>
        <a
          href="#pricing"
          data-testid="home-pricing-link"
          className="text-lg ml-3"
          style={{ color: "oklch(0.95 0.05 70)" }}
        >
          {t("landingNav.pricing")}
        </a>
      </nav>

      <LanguageMenu onChangeLanguage={handleLanguageChange} />

      {isUserLoggedIn ? (
        <Link
          to="/dashboard"
          data-testid="home-dashboard-link"
          className="pbtn sm"
        >
          {t("landingNav.myDashboard")}
        </Link>
      ) : (
        <>
          <Link
            to="/login"
            data-testid="home-login-link"
            className="pbtn sm secondary"
          >
            {t("nav.login")}
          </Link>
          <Link
            to="/register"
            data-testid="home-signup-link"
            className="pbtn sm"
          >
            {t("landingNav.signUp")}
          </Link>
        </>
      )}
    </header>
  );
}
