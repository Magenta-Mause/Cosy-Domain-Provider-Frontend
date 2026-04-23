import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { ErrorMessage } from "@/components/pixel/error-message";
import { FlatPanel } from "@/components/pixel/panel";
import { Button } from "@/components/ui/button";
import { DomainDetailHeader } from "../components/domain-detail-header";
import type { LabelAvailability } from "../lib";
import { PlanSelector } from "./components/plan-selector";
import { useCreateSubdomainLogic } from "./useCreateSubdomainLogic";

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
      <span className="text-base text-success">
        ✓ {t("createSubdomain.labelAvailable")}
      </span>
    );
  if (availability === "taken")
    return <ErrorMessage>{t("createSubdomain.labelTaken")}</ErrorMessage>;
  if (availability === "reserved")
    return <ErrorMessage>{t("createSubdomain.labelReserved")}</ErrorMessage>;
  return null;
}

export function CreateSubdomainPage() {
  const { t } = useTranslation();
  const {
    isPlus,
    isVerified,
    namingMode,
    setNamingMode,
    label,
    setLabel,
    labelAvailability,
    targetIp,
    setTargetIp,
    hasSubmitted,
    isSubmitting,
    labelValid,
    ipValid,
    canSubmit,
    errorMessage,
    handleSubmit,
  } = useCreateSubdomainLogic();

  const labelInvalid = hasSubmitted && namingMode === "custom" && !labelValid;

  return (
    <div className="min-h-screen bg-background">
      <DomainDetailHeader isCreateMode domain={undefined} />
      <div className="px-7 pb-20 max-w-[1100px] mx-auto mt-9">
        <FlatPanel className="p-7">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <fieldset
              className="border-none p-0 m-0 flex flex-col gap-4"
              disabled={isSubmitting}
            >
              <legend className="sr-only">
                {t("domainDetail.formLegend")}
              </legend>

              <PlanSelector namingMode={namingMode} onSelect={setNamingMode} />

              {namingMode === "custom" && !isPlus && (
                <div className="flex flex-col gap-2 p-4 rounded-radius border-[2px] border-foreground bg-secondary-background">
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
                      setLabel(e.target.value.toLowerCase().trim())
                    }
                    placeholder="cosy-australania"
                  />
                  <div className="text-base opacity-[0.65]">
                    {t("createSubdomain.labelHint")}
                  </div>
                  <LabelAvailabilityIndicator
                    availability={labelAvailability}
                  />
                  {labelInvalid && labelAvailability === "idle" && (
                    <ErrorMessage>
                      {t("domainDetail.labelInvalid")}
                    </ErrorMessage>
                  )}
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
                  onChange={(e) => setTargetIp(e.target.value.trim())}
                  placeholder="203.0.113.42"
                  inputMode="decimal"
                />
                <div className="text-base opacity-[0.65]">
                  {t("createSubdomain.targetIpHint")}
                </div>
                {hasSubmitted && !ipValid && (
                  <ErrorMessage>{t("domainDetail.ipInvalid")}</ErrorMessage>
                )}
              </div>
            </fieldset>

            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

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
                  : t("domainDetail.createAction")}
              </Button>
            </div>
          </form>
        </FlatPanel>
      </div>
    </div>
  );
}
