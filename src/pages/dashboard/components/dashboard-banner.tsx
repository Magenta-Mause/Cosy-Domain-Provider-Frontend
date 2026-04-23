import { useTranslation } from "react-i18next";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

interface DashboardBannerProps {
  isVerified: boolean;
  onCreateNew: () => void;
}

export function DashboardBanner({
  isVerified,
  onCreateNew,
}: DashboardBannerProps) {
  const { t } = useTranslation();

  return (
    <PageHeader>
      <div className="flex items-end gap-4 mb-4">
        <div className="flex-1 flex flex-col gap-2">
          <div
            className="pixel text-[11px]"
            style={{ color: "oklch(0.92 0.05 70)" }}
          >
            {t("dashboard.postOfficeLabel")}
          </div>
          <h1
            style={{
              color: "oklch(0.95 0.08 70)",
              textShadow: "3px 3px 0 oklch(0.25 0.08 30)",
            }}
          >
            {t("dashboard.title")}
          </h1>
        </div>
        <Button
          type="button"
          data-testid="dashboard-create-new-btn"
          size="lg"
          onClick={onCreateNew}
        >
          {isVerified ? <>+ {t("dashboard.createNew")}</> : <>Verify Account</>}
        </Button>
      </div>
    </PageHeader>
  );
}
