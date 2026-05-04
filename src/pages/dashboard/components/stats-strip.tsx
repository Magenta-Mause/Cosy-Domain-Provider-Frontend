import { useTranslation } from "react-i18next";

import type { SubdomainDto } from "@/api/generated/model";
import { SubdomainDtoStatus } from "@/api/generated/model";
import { FlatPanel } from "@/components/pixel/panel";

interface StatsStripProps {
  readonly subdomains: SubdomainDto[];
}

export function StatsStrip({ subdomains }: StatsStripProps) {
  const { t } = useTranslation();

  const onlineCount = subdomains.filter(
    (d) => d.status === SubdomainDtoStatus.ACTIVE,
  ).length;
  const pendingCount = subdomains.filter(
    (d) => d.status === SubdomainDtoStatus.PENDING,
  ).length;

  const stats = [
    {
      label: t("dashboard.statsMailboxes"),
      value: String(subdomains.length),
      sub: t("dashboard.statsDomainsRegistered"),
    },
    {
      label: t("status.active"),
      value: String(onlineCount),
      sub:
        onlineCount === subdomains.length && subdomains.length > 0
          ? t("dashboard.statsAllActive")
          : t("dashboard.statsOnline"),
    },
    {
      label: t("status.pending"),
      value: String(pendingCount),
      sub: t("dashboard.statsAwaitingVerification"),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
      {stats.map((s) => (
        <FlatPanel key={s.label} className="p-4">
          <div className="pixel text-[10px] opacity-70">
            {s.label.toUpperCase()}
          </div>
          <div className="pixel text-[22px] mt-2 text-btn-primary">
            {s.value}
          </div>
          <div className="text-[15px] mt-1 opacity-75">{s.sub}</div>
        </FlatPanel>
      ))}
    </div>
  );
}
