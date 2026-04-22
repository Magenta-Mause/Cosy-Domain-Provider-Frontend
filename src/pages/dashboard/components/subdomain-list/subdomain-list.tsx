import { useTranslation } from "react-i18next";

import type { SubdomainDto } from "@/api/generated/model";
import { DotLoader } from "@/components/pixel/dot-loader";
import { FlatPanel } from "@/components/pixel/panel";

import { SubdomainListItem } from "./components/subdomain-list-item.tsx";

interface SubdomainListProps {
  subdomains: SubdomainDto[];
  isLoading: boolean;
  isError: boolean;
  isVerified: boolean;
}

export function SubdomainList({
  subdomains,
  isLoading,
  isError,
  isVerified,
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
      <FlatPanel
        className="p-6 text-center"
        style={{ color: "var(--destructive)" }}
      >
        ⚠ {t("dashboard.loadError")}
      </FlatPanel>
    );
  }

  if (subdomains.length === 0) {
    return (
      <FlatPanel className="p-6 text-center text-lg">
        {isVerified ? t("dashboard.empty") : t("dashboard.emptyUnverified")}
      </FlatPanel>
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
