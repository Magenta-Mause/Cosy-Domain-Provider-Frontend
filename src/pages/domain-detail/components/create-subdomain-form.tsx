import { useTranslation } from "react-i18next";

import { ErrorMessage } from "@/components/pixel/error-message";
import type { LabelAvailability, NamingMode } from "@/pages/domain-detail/lib";

import { CreateModeFields } from "./overview-tab/components/create-mode-fields";
import { OverviewActions } from "./overview-tab/components/overview-actions";
import { TargetIpField } from "./overview-tab/components/target-ip-field";

interface CreateSubdomainFormProps {
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
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function CreateSubdomainForm({
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
  onSubmit,
}: CreateSubdomainFormProps) {
  const { t } = useTranslation();

  const labelInvalid = hasSubmitted && namingMode === "custom" && !labelValid;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <fieldset
        className="border-none p-0 m-0 flex flex-col gap-10"
        disabled={isSubmitting || isDeleting}
      >
        <legend className="sr-only">{t("domainDetail.formLegend")}</legend>

        <CreateModeFields
          isPlus={isPlus}
          isVerified={isVerified}
          label={label}
          onLabelChange={onLabelChange}
          labelInvalid={labelInvalid}
          labelAvailability={labelAvailability}
          namingMode={namingMode}
          onNamingModeChange={onNamingModeChange}
        />

        <TargetIpField
          targetIp={targetIp}
          onTargetIpChange={onTargetIpChange}
          hasSubmitted={hasSubmitted}
          ipValid={ipValid}
        />
      </fieldset>

      {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}

      <OverviewActions
        canSubmit={canSubmit}
        isSubmitting={isSubmitting}
        isCreateMode
      />
    </form>
  );
}
