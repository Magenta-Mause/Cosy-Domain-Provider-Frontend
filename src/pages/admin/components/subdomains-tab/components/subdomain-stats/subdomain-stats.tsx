import { useTranslation } from "react-i18next";

import { FlatPanel } from "@/components/pixel/panel";

interface SubdomainStatsProps {
  readonly total: number;
  readonly failed: number;
}

export function SubdomainStats({ total, failed }: SubdomainStatsProps) {
  const { t } = useTranslation();
  const stats = [
    {
      label: t("admin.statTotal"),
      value: total,
      sub: t("admin.statTotalSub"),
      color: "text-btn-primary",
    },
    {
      label: t("admin.statFailed"),
      value: failed,
      sub: t("admin.statFailedSub"),
      color: "text-destructive",
    },
    {
      label: t("admin.statActive"),
      value: total - failed,
      sub: t("admin.statActiveSub"),
      color: "text-green-600",
    },
  ];

  return (
    <div className="flex gap-4">
      {stats.map((s) => (
        <FlatPanel key={s.label} className="p-4 flex-1">
          <div className="pixel text-[10px] opacity-70">{s.label}</div>
          <div className={`pixel text-[22px] mt-2 ${s.color}`}>{s.value}</div>
          <div className="text-[15px] mt-1 opacity-75">{s.sub}</div>
        </FlatPanel>
      ))}
    </div>
  );
}
