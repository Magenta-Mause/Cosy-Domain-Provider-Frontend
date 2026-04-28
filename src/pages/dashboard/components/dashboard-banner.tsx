import { useTranslation } from "react-i18next";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

interface DashboardBannerProps {
  isVerified: boolean;
  isMfaEnabled: boolean;
  isSlotsExhausted: boolean;
  userTier: "FREE" | "PLUS" | null;
  onCreateNew: () => void;
}

export function DashboardBanner({
  isVerified,
  isMfaEnabled,
  isSlotsExhausted,
  userTier,
  onCreateNew,
}: DashboardBannerProps) {
  const { t } = useTranslation();

  const tooltipText = isSlotsExhausted
    ? userTier === "PLUS"
      ? t("dashboard.slotsExhaustedPlus")
      : t("dashboard.slotsExhaustedFree")
    : null;

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

        <div className="relative group shrink-0">
          <Button
            type="button"
            data-testid="dashboard-create-new-btn"
            size="lg"
            onClick={onCreateNew}
            disabled={isSlotsExhausted}
          >
            {!isVerified ? (
              <>{t("dashboard.verifyAccount")}</>
            ) : !isMfaEnabled ? (
              <>{t("dashboard.setupMfa")}</>
            ) : (
              <>+ {t("dashboard.createNew")}</>
            )}
          </Button>
          {tooltipText && (
            <div className="pointer-events-none absolute bottom-full right-0 mb-2 w-64 rounded-radius-sm bg-foreground px-3 py-2 text-xs text-background opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
              {tooltipText}
            </div>
          )}
        </div>
      </div>
    </PageHeader>
  );
}
