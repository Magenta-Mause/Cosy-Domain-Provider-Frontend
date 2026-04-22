import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { AppHeader } from "@/components/layout/app-header";

export function BillingHeader() {
  const { t } = useTranslation();

  return (
    <div className="sky-bg">
      <AppHeader />
      <div style={{ padding: "20px 28px", maxWidth: 600, margin: "0 auto" }}>
        <Link
          to="/dashboard"
          data-testid="billing-back-link"
          style={{
            color: "oklch(0.95 0.08 70)",
            fontSize: 16,
            display: "block",
            marginBottom: 12,
          }}
        >
          ← {t("dashboard.title")}
        </Link>
        <h1
          style={{
            color: "oklch(0.95 0.08 70)",
            textShadow: "3px 3px 0 oklch(0.25 0.08 30)",
          }}
        >
          {t("billing.title")}
        </h1>
      </div>
    </div>
  );
}
