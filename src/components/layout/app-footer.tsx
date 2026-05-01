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
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-foreground opacity-60">
        <a
          href="https://github.com/magenta-mause"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("footer.githubLabel")}
          className="text-foreground hover:opacity-100 transition-opacity"
          data-testid="footer-github-link"
        >
          <GitHubIcon />
        </a>
        <span className="opacity-40 text-xl">·</span>
        <span>{t("footer.madeBy")}</span>
        <span className="opacity-40 text-xl">·</span>
        <nav
          aria-label={t("footer.legalNav")}
          className="flex items-center gap-3"
        >
          <Link
            to="/legal-notice"
            className="text-foreground hover:opacity-100 transition-opacity"
            data-testid="footer-impressum-link"
          >
            {t("footer.impressum")}
          </Link>
          <span className="opacity-40 text-xl">·</span>
          <Link
            to="/privacy"
            className="text-foreground hover:opacity-100 transition-opacity"
            data-testid="footer-datenschutz-link"
          >
            {t("footer.datenschutz")}
          </Link>
          <span className="opacity-40 text-xl">·</span>
          <Link
            to="/terms"
            className="text-foreground hover:opacity-100 transition-opacity"
            data-testid="footer-agb-link"
          >
            {t("footer.agb")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
