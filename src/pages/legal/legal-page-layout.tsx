import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface LegalPageLayoutProps {
  title: string;
  children: ReactNode;
}

export function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/"
          className="text-sm opacity-60 hover:opacity-100 transition-opacity mb-8 inline-block"
          data-testid="legal-back-link"
        >
          {t("legal.back")}
        </Link>
        <h1 className="text-2xl font-bold mt-4 mb-8">{title}</h1>
        <div className="space-y-6 text-base leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
