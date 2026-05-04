import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/pixel/badge";
import { ErrorMessage } from "@/components/pixel/error-message";
import { FormField } from "@/components/ui/form-field";
import type { LabelAvailability, NamingMode } from "@/pages/domain-detail/lib";

import { LabelAvailabilityIndicator } from "./label-availability-indicator";
import { PlanCard } from "./plan-card";

interface CreateModeFieldsProps {
  readonly isPlus: boolean;
  readonly isVerified: boolean | null;
  readonly label: string;
  readonly onLabelChange: (v: string) => void;
  readonly labelInvalid: boolean;
  readonly labelAvailability: LabelAvailability;
  readonly namingMode: NamingMode;
  readonly onNamingModeChange: (mode: NamingMode) => void;
}

export function CreateModeFields({
  isPlus,
  isVerified,
  label,
  onLabelChange,
  labelInvalid,
  labelAvailability,
  namingMode,
  onNamingModeChange,
}: CreateModeFieldsProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className={"flex flex-col gap-2"}>
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
      </div>

      {namingMode === "custom" && !isPlus ? (
        <div className="flex flex-col gap-3 p-4 rounded-radius border-[2px] border-foreground bg-secondary-background">
          <p className="text-sm opacity-80">
            {isVerified
              ? t("createSubdomain.upgradeRequired")
              : t("createSubdomain.verifyFirst")}
          </p>
          <Link
            to={isVerified ? "/billing" : "/verify"}
            className="pbtn sm w-fit"
          >
            {isVerified
              ? t("createSubdomain.upgradeBtn")
              : t("createSubdomain.verifyBtn")}
          </Link>
        </div>
      ) : null}

      {namingMode === "custom" && isPlus ? (
        <div className="flex flex-col gap-2">
          <FormField
            id="label"
            label={t("createSubdomain.label")}
            value={label}
            onChange={(v) =>
              onLabelChange(v.toLowerCase().replaceAll(" ", "-"))
            }
            placeholder="my-castle"
            required
            invalid={labelInvalid}
            suffix=".play.cosy-hosting.net"
            testId="domain-detail-label-input"
            hint={t("createSubdomain.labelHint")}
          />
          <LabelAvailabilityIndicator availability={labelAvailability} />
          {labelInvalid && labelAvailability === "idle" ? (
            <ErrorMessage>{t("domainDetail.labelInvalid")}</ErrorMessage>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
