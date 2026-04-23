import { useTranslation } from "react-i18next";

import { ErrorMessage } from "@/components/pixel/error-message";
import { Panel } from "@/components/pixel/panel";
import { Button } from "@/components/ui/button";

interface DangerTabProps {
  errorMessage: string | null;
  isDeleting: boolean;
  onDelete: () => void;
}

export function DangerTab({
  errorMessage,
  isDeleting,
  onDelete,
}: DangerTabProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-destructive">{t("domainDetail.dangerZone")}</h3>
      {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
      <Panel className="p-[18px]" style={{ borderColor: "var(--destructive)" }}>
        <div className="flex gap-4 items-center">
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="pixel text-[13px] text-destructive">
              {t("domainDetail.dangerZone")}
            </div>
            <div className="text-base opacity-80">
              {t("domainDetail.deleteDescription")}
            </div>
          </div>
          <Button
            type="button"
            data-testid="domain-detail-delete-btn"
            variant="destructive"
            disabled={isDeleting}
            onClick={onDelete}
          >
            {isDeleting ? t("dashboard.deleting") : t("dashboard.delete")}
          </Button>
        </div>
      </Panel>
    </div>
  );
}
