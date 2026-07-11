import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { LanguageMenu } from "@/components/layout/language-menu";
import { FlatPanel } from "@/components/pixel/panel";

interface LegalPageLayoutProps {
  readonly title: string;
  readonly children: ReactNode;
}

export function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  const { t } = useTranslation();

  return (
    <div className="sky-bg min-h-screen relative overflow-hidden px-6 py-12">
      <div
        className="absolute rounded-full"
        style={{
          right: "8%",
          top: "6%",
          width: 72,
          height: 72,
          background: "oklch(0.95 0.03 80)",
          boxShadow:
            "0 0 0 4px oklch(0.3 0.02 260), 0 0 40px oklch(0.95 0.03 80 / 0.4)",
        }}
        aria-hidden
      />
      <div
        className="absolute opacity-[0.85]"
        style={{ left: "12%", top: "12%", color: "oklch(0.95 0.02 240)" }}
        aria-hidden
      >
        <div
          style={{
            width: 100,
            height: 18,
            background: "currentColor",
            borderRadius: 10,
          }}
        />
        <div
          style={{
            width: 70,
            height: 14,
            background: "currentColor",
            borderRadius: 10,
            marginTop: -6,
            marginLeft: 12,
          }}
        />
      </div>

      <Link
        to="/"
        className="pbtn ghost fixed top-6 left-7 z-[5]"
        style={{ color: "oklch(0.95 0.08 70)" }}
        data-testid="legal-back-link"
      >
        {t("legal.back")}
      </Link>

      <div className="fixed top-6 right-7 z-[5]">
        <LanguageMenu />
      </div>

      <div className="relative z-[2] max-w-2xl mx-auto">
        <FlatPanel className="p-8">
          <h1 className="text-2xl font-bold mb-8">{title}</h1>
          <div className="space-y-6 text-base leading-relaxed">{children}</div>
        </FlatPanel>
      </div>
    </div>
  );
}
