import { useTranslation } from "react-i18next";

import type { AdminWatchtowerScan } from "@/api/admin-api";

import { categoryAccent, formatPaths, needsReview } from "../../lib";
import { WatchtowerBadge } from "../watchtower-badge";

interface WatchtowerCardProps {
  readonly scan: AdminWatchtowerScan;
  readonly onSelect: (uuid: string) => void;
}

export function WatchtowerCard({ scan, onSelect }: WatchtowerCardProps) {
  const { t } = useTranslation("admin");
  const accent = categoryAccent(scan.category);

  return (
    <button
      type="button"
      onClick={() => onSelect(scan.uuid)}
      data-testid={`watchtower-card-${scan.label}`}
      className={`bg-secondary-background border-[3px] ${accent.border} rounded-radius-lg overflow-hidden flex flex-col text-left cursor-pointer`}
      style={{ boxShadow: "6px 6px 0 0 var(--shadow)" }}
    >
      <div
        className={`h-[180px] overflow-hidden border-b-[3px] ${accent.border} bg-background relative`}
      >
        {scan.screenshotUrl ? (
          <img
            src={scan.screenshotUrl}
            alt={t("watchtower.screenshotAlt", { fqdn: scan.fqdn })}
            className="w-full h-full object-cover object-top"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[15px] opacity-60">
            {t("watchtower.noScreenshot")}
          </div>
        )}
        {needsReview(scan) ? (
          <span className="pixel text-[9px] absolute top-2 right-2 bg-destructive text-paper border-2 border-foreground rounded-radius-sm px-2 py-1">
            {t("watchtower.needsReview")}
          </span>
        ) : null}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-bold">{scan.label}</span>
          <WatchtowerBadge category={scan.category} />
        </div>
        <div className="text-[15px] opacity-70 truncate">
          {t("watchtower.pathsLabel")} {formatPaths(scan.visitedPaths)}
        </div>
        <div className={`text-[16px] leading-tight ${accent.text}`}>
          {scan.summary}
        </div>
      </div>
    </button>
  );
}
