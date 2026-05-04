import { useTranslation } from "react-i18next";

import type { SubdomainDto } from "@/api/generated/model";
import { DotLoader } from "@/components/pixel/dot-loader";
import { FlatPanel } from "@/components/pixel/panel";

import { SubdomainListItem } from "./components/subdomain-list-item.tsx";

interface SubdomainListProps {
  readonly subdomains: SubdomainDto[];
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly isVerified: boolean;
  readonly isMfaEnabled: boolean;
}

export function SubdomainList({
  subdomains,
  isLoading,
  isError,
  isVerified,
  isMfaEnabled,
}: SubdomainListProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <FlatPanel className="p-10 text-center text-lg">
        <DotLoader />
      </FlatPanel>
    );
  }

  if (isError) {
    return (
      <FlatPanel className="p-6 text-center text-destructive">
        ⚠ {t("dashboard.loadError")}
      </FlatPanel>
    );
  }

  if (subdomains.length === 0) {
    let emptyMessage: string = t("dashboard.empty");
    if (!isVerified) emptyMessage = t("dashboard.emptyUnverified");
    else if (!isMfaEnabled) emptyMessage = t("dashboard.emptyMfaRequired");
    return (
      <FlatPanel className="p-6 text-center text-lg">{emptyMessage}</FlatPanel>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {subdomains.map((d) => (
        <SubdomainListItem key={d.uuid} domain={d} />
      ))}
    </div>
  );
}
