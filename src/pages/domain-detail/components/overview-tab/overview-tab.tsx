import { useTranslation } from "react-i18next";

import type { SubdomainDto } from "@/api/generated/model";
import { ErrorMessage } from "@/components/pixel/error-message";

import { DomainMetaCards } from "./components/domain-meta-cards.tsx";
import { OverviewActions } from "./components/overview-actions";
import { ReadonlyLabelField } from "./components/readonly-label-field";
import { TargetIpTabs } from "./components/target-ip-tabs";

interface OverviewTabProps {
  domain: SubdomainDto | undefined;
  label: string;
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
  ipv4Valid: boolean;
  ipv6Valid: boolean;
  atLeastOneIp: boolean;
  canSubmit: boolean;
  createdAt: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function OverviewTab({
  domain,
  label,
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
  ipv4Valid,
  ipv6Valid,
  atLeastOneIp,
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
        isCreateMode={false}
      />
    </form>
  );
}
