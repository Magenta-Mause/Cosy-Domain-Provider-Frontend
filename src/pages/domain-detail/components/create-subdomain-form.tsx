import type { SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";

import { ErrorMessage } from "@/components/pixel/error-message";
import type { LabelAvailability, NamingMode } from "@/pages/domain-detail/lib";

import { CreateModeFields } from "./overview-tab/components/create-mode-fields";
import { OverviewActions } from "./overview-tab/components/overview-actions";
import { TargetIpTabs } from "./overview-tab/components/target-ip-tabs";

interface CreateSubdomainFormProps {
  readonly isPlus: boolean;
  readonly isVerified: boolean | null;
  readonly label: string;
  readonly onLabelChange: (v: string) => void;
  readonly targetIp: string;
  readonly onTargetIpChange: (v: string) => void;
  readonly targetIpv6: string;
  readonly onTargetIpv6Change: (v: string) => void;
  readonly ipTab: "ipv4" | "ipv6";
  readonly onIpTabChange: (tab: "ipv4" | "ipv6") => void;
  readonly errorMessage: string | null;
  readonly isSubmitting: boolean;
  readonly isDeleting: boolean;
  readonly hasSubmitted: boolean;
  readonly labelValid: boolean;
  readonly labelAvailability: LabelAvailability;
  readonly namingMode: NamingMode;
  readonly onNamingModeChange: (mode: NamingMode) => void;
  readonly ipv4Valid: boolean;
  readonly ipv6Valid: boolean;
  readonly atLeastOneIp: boolean;
  readonly canSubmit: boolean;
  readonly onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
}

export function CreateSubdomainForm({
  isPlus,
  isVerified,
  label,
  onLabelChange,
  targetIp,
  onTargetIpChange,
  targetIpv6,
  onTargetIpv6Change,
  ipTab,
  onIpTabChange,
  errorMessage,
  isSubmitting,
  isDeleting,
  hasSubmitted,
  labelValid,
  labelAvailability,
  namingMode,
  onNamingModeChange,
  ipv4Valid,
  ipv6Valid,
  atLeastOneIp,
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

        <TargetIpTabs
          targetIp={targetIp}
          onTargetIpChange={onTargetIpChange}
          targetIpv6={targetIpv6}
          onTargetIpv6Change={onTargetIpv6Change}
          activeTab={ipTab}
          onTabChange={onIpTabChange}
          hasSubmitted={hasSubmitted}
          ipv4Valid={ipv4Valid}
          ipv6Valid={ipv6Valid}
          atLeastOneIp={atLeastOneIp}
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
