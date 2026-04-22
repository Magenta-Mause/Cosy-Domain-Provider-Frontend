import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import type { SubdomainDto } from "@/api/generated/model";
import { Badge } from "@/components/pixel/badge";
import { ErrorMessage } from "@/components/pixel/error-message";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  LabelAvailability,
  NamingMode,
} from "@/pages/domain-detail/useDomainDetailLogic";

import { DomainMetaCards } from "./components/domain-meta-cards.tsx";

interface OverviewTabProps {
  domain: SubdomainDto | undefined;
  isCreateMode: boolean;
  isPlus: boolean;
  isVerified: boolean | null;
  label: string;
  onLabelChange: (v: string) => void;
  targetIp: string;
  onTargetIpChange: (v: string) => void;
  errorMessage: string | null;
  isSubmitting: boolean;
  isDeleting: boolean;
  hasSubmitted: boolean;
  labelValid: boolean;
  labelAvailability: LabelAvailability;
  namingMode: NamingMode;
  onNamingModeChange: (mode: NamingMode) => void;
  ipValid: boolean;
  canSubmit: boolean;
  createdAt: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

function LabelAvailabilityIndicator({
  availability,
}: {
  availability: LabelAvailability;
}) {
  const { t } = useTranslation();
  if (availability === "idle") return null;
  if (availability === "checking")
    return (
      <span className="text-base opacity-60">
        {t("createSubdomain.labelChecking")}
      </span>
    );
  if (availability === "available")
    return (
      <span className="text-base" style={{ color: "var(--success)" }}>
        ✓ {t("createSubdomain.labelAvailable")}
      </span>
    );
  if (availability === "taken")
    return <ErrorMessage>{t("createSubdomain.labelTaken")}</ErrorMessage>;
  if (availability === "reserved")
    return <ErrorMessage>{t("createSubdomain.labelReserved")}</ErrorMessage>;
  return null;
}

interface PlanCardProps {
  selected: boolean;
  onClick: () => void;
  badge: React.ReactNode;
  label: string;
}

function PlanCard({ selected, onClick, badge, label }: PlanCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 text-left p-4 bg-[var(--secondary-background)] rounded-[var(--radius)] transition-colors",
        selected
          ? "border-[3px] border-[var(--accent-2)]"
          : "border-[3px] border-[var(--foreground)] opacity-70 hover:opacity-100",
      )}
      style={{ boxShadow: "4px 4px 0 0 var(--shadow)" }}
    >
      <div className="flex justify-between items-start mb-3">
        {badge}
        <span className={cn("pcheck", selected && "checked")} aria-hidden />
      </div>
      <p className="text-sm opacity-70">{label}</p>
    </button>
  );
}

export function OverviewTab({
  domain,
  isCreateMode,
  isPlus,
  isVerified,
  label,
  onLabelChange,
  targetIp,
  onTargetIpChange,
  errorMessage,
  isSubmitting,
  isDeleting,
  hasSubmitted,
  labelValid,
  labelAvailability,
  namingMode,
  onNamingModeChange,
  ipValid,
  canSubmit,
  createdAt,
  onSubmit,
}: OverviewTabProps) {
  const { t } = useTranslation();

  const labelInvalid =
    hasSubmitted && isCreateMode && namingMode === "custom" && !labelValid;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {!isCreateMode ? (
        <DomainMetaCards domain={domain} createdAt={createdAt} />
      ) : null}

      <fieldset
        className="border-none p-0 m-0 flex flex-col gap-4"
        disabled={isSubmitting || isDeleting}
      >
        <legend className="sr-only">{t("domainDetail.formLegend")}</legend>

        {isCreateMode ? (
          <div className="flex flex-col gap-3">
            <span className="plabel">{t("createSubdomain.planSection")}</span>
            <div className="flex gap-3">
              <PlanCard
                selected={namingMode === "random"}
                onClick={() => onNamingModeChange("random")}
                badge={
                  <Badge color="gray" className="py-1">
                    Free
                  </Badge>
                }
                label={t("createSubdomain.randomName")}
              />
              <PlanCard
                selected={namingMode === "custom"}
                onClick={() => onNamingModeChange("custom")}
                badge={
                  <Badge color="accent" className="py-1">
                    Cosy+
                  </Badge>
                }
                label={t("createSubdomain.customName")}
              />
            </div>

            {namingMode === "custom" && !isPlus && (
              <div
                className="flex flex-col gap-3 p-4 rounded-[var(--radius)] border-[2px] border-[var(--foreground)]"
                style={{ background: "var(--secondary-background)" }}
              >
                {isVerified ? (
                  <>
                    <p className="text-sm opacity-80">
                      {t("createSubdomain.upgradeRequired")}
                    </p>
                    <Link to="/billing" className="pbtn sm w-fit">
                      {t("createSubdomain.upgradeBtn")}
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-sm opacity-80">
                      {t("createSubdomain.verifyFirst")}
                    </p>
                    <Link to="/verify" className="pbtn sm w-fit">
                      {t("createSubdomain.verifyBtn")}
                    </Link>
                  </>
                )}
              </div>
            )}

            {namingMode === "custom" && isPlus && (
              <div className="flex flex-col gap-2">
                <label className="plabel" htmlFor="label">
                  {t("createSubdomain.label")}
                </label>
                <input
                  id="label"
                  data-testid="domain-detail-label-input"
                  className={`pinput${labelInvalid ? " invalid" : ""}`}
                  required
                  value={label}
                  onChange={(e) =>
                    onLabelChange(e.target.value.toLowerCase().trim())
                  }
                  placeholder="my-castle"
                />
                <div className="text-base opacity-[0.65]">
                  {t("createSubdomain.labelHint")}
                </div>
                <LabelAvailabilityIndicator availability={labelAvailability} />
                {labelInvalid && labelAvailability === "idle" ? (
                  <ErrorMessage>{t("domainDetail.labelInvalid")}</ErrorMessage>
                ) : null}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <label className="plabel" htmlFor="label">
              {t("createSubdomain.label")}
            </label>
            <input
              id="label"
              data-testid="domain-detail-label-input"
              className="pinput"
              value={label}
              readOnly
            />
            <div className="text-base opacity-[0.65]">
              {t("domainDetail.labelReadonly")}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="plabel" htmlFor="targetIp">
            {t("createSubdomain.targetIp")}
          </label>
          <input
            id="targetIp"
            data-testid="domain-detail-target-ip-input"
            className={`pinput${hasSubmitted && !ipValid ? " invalid" : ""}`}
            required
            value={targetIp}
            onChange={(e) => onTargetIpChange(e.target.value.trim())}
            placeholder="203.0.113.42"
            inputMode="decimal"
          />
          <div className="text-base opacity-[0.65]">
            {t("createSubdomain.targetIpHint")}
          </div>
          {hasSubmitted && !ipValid ? (
            <ErrorMessage>{t("domainDetail.ipInvalid")}</ErrorMessage>
          ) : null}
        </div>
      </fieldset>

      {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}

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
    </form>
  );
}
