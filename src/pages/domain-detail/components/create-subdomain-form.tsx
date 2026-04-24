import { useTranslation } from "react-i18next";

import { ErrorMessage } from "@/components/pixel/error-message";
import type { LabelAvailability, NamingMode } from "@/pages/domain-detail/lib";

import { CreateModeFields } from "./overview-tab/components/create-mode-fields";
import { OverviewActions } from "./overview-tab/components/overview-actions";
import { TargetIpTabs } from "./overview-tab/components/target-ip-tabs";

interface CreateSubdomainFormProps {
  isPlus: boolean;
  isVerified: boolean | null;
  label: string;
  onLabelChange: (v: string) => void;
  targetIp: string;
  onTargetIpChange: (v: string) => void;
  targetIpv6: string;
  onTargetIpv6Change: (v: string) => void;
  ipTab: "ipv4" | "ipv6";
  onIpTabChange: (tab: "ipv4" | "ipv6") => void;
  errorMessage: string | null;
  isSubmitting: boolean;
  isDeleting: boolean;
  hasSubmitted: boolean;
  labelValid: boolean;
  labelAvailability: LabelAvailability;
  namingMode: NamingMode;
  onNamingModeChange: (mode: NamingMode) => void;
  ipv4Valid: boolean;
  ipv6Valid: boolean;
  atLeastOneIp: boolean;
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
