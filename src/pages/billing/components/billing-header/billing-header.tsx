import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { PageHeader } from "@/components/layout/page-header";

export function BillingHeader() {
  const { t } = useTranslation();

  return (
    <PageHeader maxWidth={600}>
      <Link
        to="/dashboard"
        data-testid="billing-back-link"
        className="block mb-3 text-base"
        style={{ color: "oklch(0.95 0.08 70)" }}
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
    </PageHeader>
  );
}
