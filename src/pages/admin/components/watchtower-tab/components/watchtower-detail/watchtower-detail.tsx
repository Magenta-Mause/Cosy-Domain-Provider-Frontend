import { useTranslation } from "react-i18next";

import type {
  AdminWatchtowerScan,
  WatchtowerReviewStatus,
} from "@/api/admin-api";
import { FlatPanel } from "@/components/pixel/panel";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";

import { categoryAccent } from "../../lib";
import { WatchtowerBadge } from "../watchtower-badge";
import { useWatchtowerDetailLogic } from "./useWatchtowerDetailLogic";

interface WatchtowerDetailProps {
  readonly scan: AdminWatchtowerScan;
  readonly onClose: () => void;
  readonly onSubmitReview: (
    uuid: string,
    status: WatchtowerReviewStatus,
    note: string,
  ) => Promise<AdminWatchtowerScan>;
}

export function WatchtowerDetail({
  scan,
  onClose,
  onSubmitReview,
}: WatchtowerDetailProps) {
  const { t } = useTranslation("admin");
  const { note, setNote, isSaving, saveError, decide } =
    useWatchtowerDetailLogic({ scan, onSubmitReview, onClose });
  const accent = categoryAccent(scan.category);

  return (
    <dialog
      open
      aria-label={t("watchtower.detailTitle", { fqdn: scan.fqdn })}
      className="fixed inset-0 z-50 w-full h-full max-w-none max-h-none bg-black/50 flex items-center justify-center p-4"
      data-testid="watchtower-detail"
    >
      <FlatPanel className="w-full max-w-[880px] max-h-full overflow-y-auto p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h3>{scan.label}</h3>
            <span className="text-[16px] opacity-70">{scan.fqdn}</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <WatchtowerBadge category={scan.category} />
            <Button variant="secondary" size="sm" onClick={onClose}>
              {t("watchtower.close")}
            </Button>
          </div>
        </div>

        {scan.screenshotUrl ? (
          <img
            src={scan.screenshotUrl}
            alt={t("watchtower.screenshotAlt", { fqdn: scan.fqdn })}
            className={`w-full border-[3px] ${accent.border} rounded-radius`}
          />
        ) : (
          <div className="w-full py-10 text-center border-[3px] border-dashed border-foreground rounded-radius opacity-60">
            {t("watchtower.noScreenshot")}
          </div>
        )}

        <div className={`text-[18px] leading-tight ${accent.text}`}>
          {scan.summary}
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-[16px]">
          <dt className="opacity-70">{t("watchtower.fieldOwner")}</dt>
          <dd>{scan.ownerUsername}</dd>
          <dt className="opacity-70">{t("watchtower.fieldRisk")}</dt>
          <dd>{t(`watchtower.risk.${scan.riskLevel}`)}</dd>
          <dt className="opacity-70">{t("watchtower.fieldHttpStatus")}</dt>
          <dd>{scan.httpStatus ?? "—"}</dd>
          <dt className="opacity-70">{t("watchtower.fieldScannedAt")}</dt>
          <dd>{new Date(scan.scannedAt).toLocaleString()}</dd>
          <dt className="opacity-70">{t("watchtower.fieldModel")}</dt>
          <dd className="font-mono text-[15px]">{scan.modelId}</dd>
          <dt className="opacity-70">{t("watchtower.fieldPaths")}</dt>
          <dd className="font-mono text-[15px] break-words">
            {scan.visitedPaths.length > 0 ? scan.visitedPaths.join(" · ") : "—"}
          </dd>
        </dl>

        <div className="flex flex-col gap-3 border-t-2 border-foreground pt-4">
          <div className="pixel text-[10px] opacity-70">
            {t("watchtower.reviewHeading", {
              status: t(`watchtower.review.${scan.reviewStatus}`),
            })}
          </div>
          <FormField
            id="watchtower-review-note"
            label={t("watchtower.reviewNoteLabel")}
            value={note}
            onChange={setNote}
            placeholder={t("watchtower.reviewNotePlaceholder")}
            maxLength={2000}
            disabled={isSaving}
            testId="watchtower-review-note"
          />
          {saveError ? (
            <p className="text-sm text-destructive">{saveError}</p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              disabled={isSaving}
              onClick={() => void decide("ACKNOWLEDGED")}
            >
              {t("watchtower.actionAcknowledge")}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={isSaving}
              onClick={() => void decide("DISMISSED")}
            >
              {t("watchtower.actionDismiss")}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={isSaving}
              onClick={() => void decide("ACTIONED")}
            >
              {t("watchtower.actionActioned")}
            </Button>
          </div>
        </div>
      </FlatPanel>
    </dialog>
  );
}
