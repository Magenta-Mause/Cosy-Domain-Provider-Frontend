import { useTranslation } from "react-i18next";

import { FlatPanel } from "@/components/pixel/panel";

interface UserStatsProps {
  total: number;
  unverified: number;
  plus: number;
}

export function UserStats({ total, unverified, plus }: UserStatsProps) {
  const { t } = useTranslation();

  const stats = [
    {
      label: t("admin.statUserTotal"),
      value: total,
      sub: t("admin.statUserTotalSub"),
      color: "text-btn-primary",
    },
    {
      label: t("admin.statUserUnverified"),
      value: unverified,
      sub: t("admin.statUserUnverifiedSub"),
      color: "text-orange-500",
    },
    {
      label: t("admin.statUserPlus"),
      value: plus,
      sub: t("admin.statUserPlusSub"),
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
