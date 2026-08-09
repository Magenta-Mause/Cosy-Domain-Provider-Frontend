import { useTranslation } from "react-i18next";

import type { AdminWatchtowerSummary } from "@/api/admin-api";

import type { WatchtowerFilter, WatchtowerView } from "../../lib";

interface WatchtowerToolbarProps {
  readonly view: WatchtowerView;
  readonly onViewChange: (view: WatchtowerView) => void;
  readonly filter: WatchtowerFilter;
  readonly onFilterChange: (filter: WatchtowerFilter) => void;
  readonly summary: AdminWatchtowerSummary | null;
}

export function WatchtowerToolbar({
  view,
  onViewChange,
  filter,
  onFilterChange,
  summary,
}: WatchtowerToolbarProps) {
  const { t } = useTranslation("admin");

  const views: WatchtowerView[] = ["cards", "list"];
  const filters: { key: WatchtowerFilter; count?: number }[] = [
    { key: "all", count: summary?.scannedSubdomains },
    { key: "cosy", count: summary?.cosyFrontends },
    { key: "benign", count: summary?.benign },
    { key: "flagged", count: summary?.flagged },
    { key: "offline", count: summary?.unreachable },
  ];

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div
        className="flex border-[3px] border-foreground rounded-radius overflow-hidden"
        style={{ boxShadow: "4px 4px 0 0 var(--shadow)" }}
      >
        {views.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onViewChange(v)}
            data-testid={`watchtower-view-${v}`}
            className={`pixel text-[10px] px-4 py-3 cursor-pointer ${
              view === v
                ? "bg-foreground text-white"
                : "bg-white text-foreground"
            }`}
          >
            {t(`watchtower.view.${v}`)}
          </button>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {filters.map(({ key, count }) => (
          <button
            key={key}
            type="button"
            onClick={() => onFilterChange(key)}
            data-testid={`watchtower-filter-${key}`}
            className={`text-[17px] border-2 rounded-radius-sm px-3 py-1 cursor-pointer ${
              filter === key
                ? "bg-foreground text-white border-foreground"
                : key === "flagged"
                  ? "bg-white text-destructive border-destructive"
                  : "bg-white text-foreground border-foreground"
            }`}
          >
            {t(`watchtower.filter.${key}`)}
            {count === undefined ? "" : ` (${count})`}
          </button>
        ))}
      </div>
    </div>
  );
}
