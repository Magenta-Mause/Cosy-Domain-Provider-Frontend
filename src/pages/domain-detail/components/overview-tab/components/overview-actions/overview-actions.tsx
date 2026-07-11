import { Link } from "@tanstack/react-router";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

function submitButtonLabel(
  t: TFunction,
  isSubmitting: boolean,
  isCreateMode: boolean,
): string {
  if (isSubmitting) return t("domainDetail.saving");
  return isCreateMode
    ? t("domainDetail.createAction")
    : t("domainDetail.saveAction");
}

import { Button } from "@/components/ui/button";

interface OverviewActionsProps {
  readonly canSubmit: boolean;
  readonly isSubmitting: boolean;
  readonly isCreateMode: boolean;
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
        {submitButtonLabel(t, isSubmitting, isCreateMode)}
      </Button>
    </div>
  );
}
