import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

interface OverviewActionsProps {
  canSubmit: boolean;
  isSubmitting: boolean;
  isCreateMode: boolean;
}

export function OverviewActions({
  canSubmit,
  isSubmitting,
  isCreateMode,
}: OverviewActionsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex gap-3 justify-end">
      <Link
        to="/dashboard"
        data-testid="domain-detail-back-btn"
        className="pbtn ghost"
      >
        ← {t("domainDetail.backToDomains")}
      </Link>
      <Button
        type="submit"
        data-testid="domain-detail-submit-btn"
        size="lg"
        disabled={!canSubmit}
      >
        {isSubmitting
          ? t("domainDetail.saving")
          : isCreateMode
            ? t("domainDetail.createAction")
            : t("domainDetail.saveAction")}
      </Button>
    </div>
  );
}
