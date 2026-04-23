import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import cosyIcon from "@/assets/cosy-logo.webp";
import useAuthInformation from "@/hooks/useAuthInformation/useAuthInformation";

export function LandingNav() {
  const { t } = useTranslation();
  const { isUserLoggedIn } = useAuthInformation();

  return (
    <header className="flex items-center gap-4 relative z-[3] px-8 py-5">
      <Link
        to="/dashboard"
        data-testid="home-logo-link"
        className="flex items-center gap-2.5 no-underline hover:no-underline"
      >
        <img src={cosyIcon} alt="Cosy" className="h-12" />
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
