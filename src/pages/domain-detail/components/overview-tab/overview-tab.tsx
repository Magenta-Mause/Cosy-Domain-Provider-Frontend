import type { SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";

import type { SubdomainDto } from "@/api/generated/model";
import { ErrorMessage } from "@/components/pixel/error-message";

import { DomainMetaCards } from "./components/domain-meta-cards.tsx";
import { OverviewActions } from "./components/overview-actions";
import { ReadonlyLabelField } from "./components/readonly-label-field";
import { TargetIpTabs } from "./components/target-ip-tabs";

interface OverviewTabProps {
  readonly domain: SubdomainDto | undefined;
  readonly label: string;
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
  readonly ipv4Valid: boolean;
  readonly ipv6Valid: boolean;
  readonly atLeastOneIp: boolean;
  readonly canSubmit: boolean;
  readonly createdAt: string;
  readonly onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
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
