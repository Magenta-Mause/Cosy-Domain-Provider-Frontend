import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

function createButtonLabel(
  t: TFunction,
  isVerified: boolean,
  isMfaEnabled: boolean,
): string | null {
  if (isVerified && isMfaEnabled) return null;
  if (isVerified) return t("dashboard.setupMfa");
  return t("dashboard.verifyAccount");
}

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

interface DashboardBannerProps {
  readonly isVerified: boolean;
  readonly isMfaEnabled: boolean;
  readonly isSlotsExhausted: boolean;
  readonly domainCreationEnabled: boolean;
  readonly userTier: "FREE" | "PLUS" | null;
  readonly onCreateNew: () => void;
}

export function DashboardBanner({
  isVerified,
  isMfaEnabled,
  isSlotsExhausted,
  domainCreationEnabled,
  userTier,
  onCreateNew,
}: DashboardBannerProps) {
  const { t } = useTranslation();

  const isButtonDisabled = !domainCreationEnabled || isSlotsExhausted;

  const exhaustedText =
    userTier === "PLUS"
      ? t("dashboard.slotsExhaustedPlus")
      : t("dashboard.slotsExhaustedFree");
  let tooltipText: string | null = null;
  if (domainCreationEnabled) {
    tooltipText = isSlotsExhausted ? exhaustedText : null;
  } else {
    tooltipText = t("dashboard.creationDisabled");
  }

  return (
    <PageHeader>
      <div className="flex flex-wrap items-end gap-4 mb-4">
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
            disabled={isButtonDisabled}
          >
            {createButtonLabel(t, isVerified, isMfaEnabled) ?? (
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
