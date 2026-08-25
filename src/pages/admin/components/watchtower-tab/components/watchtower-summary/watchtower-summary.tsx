import { useTranslation } from "react-i18next";

import type { AdminWatchtowerSummary } from "@/api/admin-api";
import { FlatPanel } from "@/components/pixel/panel";

interface WatchtowerSummaryProps {
  readonly summary: AdminWatchtowerSummary | null;
}

export function WatchtowerSummary({ summary }: WatchtowerSummaryProps) {
  const { t } = useTranslation("admin");
  if (!summary) return null;

  const stats = [
    {
      label: t("watchtower.statScanned"),
      value: summary.scannedSubdomains,
      sub: t("watchtower.statScannedSub", { total: summary.totalSubdomains }),
      color: "text-btn-primary",
    },
    {
      label: t("watchtower.statCosy"),
      value: summary.cosyFrontends,
      sub: t("watchtower.statCosySub"),
      color: "text-accent-3",
    },
    {
      label: t("watchtower.statBenign"),
      value: summary.benign,
      sub: t("watchtower.statBenignSub"),
      color: "text-success",
    },
    {
      label: t("watchtower.statFlagged"),
      value: summary.flagged,
      sub: t("watchtower.statFlaggedSub", { pending: summary.pendingReview }),
      color: "text-destructive",
    },
  ];

  return (
    <div className="flex flex-wrap gap-4" data-testid="watchtower-summary">
      {stats.map((s) => (
        <FlatPanel key={s.label} className="p-4 flex-1 min-w-[160px]">
          <div className="pixel text-[10px] opacity-70">{s.label}</div>
          <div className={`pixel text-[22px] mt-2 ${s.color}`}>{s.value}</div>
          <div className="text-[15px] mt-1 opacity-75">{s.sub}</div>
        </FlatPanel>
      ))}
    </div>
  );
}
