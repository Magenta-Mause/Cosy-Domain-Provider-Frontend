import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { GitHubIcon } from "@/components/ui/brand-icons";

export function AppFooter() {
  const { t } = useTranslation();

  return (
    <footer
      role="contentinfo"
      className="border-t py-5 px-6 bg-background"
      style={{ borderTopColor: "var(--foreground-muted)" }}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm opacity-60">
        <a
          href="https://github.com/magenta-mause"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("footer.githubLabel")}
          className="hover:opacity-100 transition-opacity"
          data-testid="footer-github-link"
        >
          <GitHubIcon />
        </a>
        <span>{t("footer.madeBy")}</span>
        <nav aria-label={t("footer.legalNav")} className="flex gap-4">
          <Link
            to="/impressum"
            className="hover:opacity-100 transition-opacity"
            data-testid="footer-impressum-link"
          >
            {t("footer.impressum")}
          </Link>
          <Link
            to="/datenschutz"
            className="hover:opacity-100 transition-opacity"
            data-testid="footer-datenschutz-link"
          >
            {t("footer.datenschutz")}
          </Link>
          <Link
            to="/agb"
            className="hover:opacity-100 transition-opacity"
            data-testid="footer-agb-link"
          >
            {t("footer.agb")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
