import { useTranslation } from "react-i18next";

import type { SubdomainDto } from "@/api/generated/model";
import { ErrorMessage } from "@/components/pixel/error-message";

import { DomainMetaCards } from "./components/domain-meta-cards.tsx";
import { OverviewActions } from "./components/overview-actions";
import { ReadonlyLabelField } from "./components/readonly-label-field";
import { TargetIpField } from "./components/target-ip-field";

interface OverviewTabProps {
  domain: SubdomainDto | undefined;
  label: string;
  targetIp: string;
  onTargetIpChange: (v: string) => void;
  errorMessage: string | null;
  isSubmitting: boolean;
  isDeleting: boolean;
  hasSubmitted: boolean;
  ipValid: boolean;
  canSubmit: boolean;
  createdAt: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function OverviewTab({
  domain,
  label,
  targetIp,
  onTargetIpChange,
  errorMessage,
  isSubmitting,
  isDeleting,
  hasSubmitted,
  ipValid,
  canSubmit,
  createdAt,
  onSubmit,
}: OverviewTabProps) {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <DomainMetaCards domain={domain} createdAt={createdAt} />

      <fieldset
        className="border-none p-0 m-0 flex flex-col gap-10"
        disabled={isSubmitting || isDeleting}
      >
        <legend className="sr-only">{t("domainDetail.formLegend")}</legend>

        <ReadonlyLabelField label={label} fqdn={domain?.fqdn} />

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
        isCreateMode={false}
      />
    </form>
  );
}
