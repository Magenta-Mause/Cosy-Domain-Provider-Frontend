import { useTranslation } from "react-i18next";

import { WatchtowerCard } from "./components/watchtower-card";
import { WatchtowerDetail } from "./components/watchtower-detail";
import { WatchtowerRunBanner } from "./components/watchtower-run-banner";
import { WatchtowerSummary } from "./components/watchtower-summary";
import { WatchtowerTable } from "./components/watchtower-table";
import { WatchtowerToolbar } from "./components/watchtower-toolbar";
import { useWatchtowerTabLogic } from "./useWatchtowerTabLogic";

interface WatchtowerTabProps {
  readonly adminKey: string;
}

export function WatchtowerTab({ adminKey }: WatchtowerTabProps) {
  const { t } = useTranslation("admin");
  const {
    isLoading,
    error,
    summary,
    visibleScans,
    view,
    setView,
    filter,
    setFilter,
    selectedScan,
    selectScan,
    closeDetail,
    submitReview,
  } = useWatchtowerTabLogic(adminKey);

  if (isLoading)
    return <p className="text-sm opacity-60 py-4">{t("admin.loading")}</p>;
  if (error) return <p className="text-sm text-destructive py-4">{error}</p>;

  return (
    <div className="flex flex-col gap-4" data-testid="watchtower-tab">
      <WatchtowerRunBanner
        lastScanAt={summary?.lastScanAt ?? null}
        scannedSubdomains={summary?.scannedSubdomains ?? 0}
      />
      <WatchtowerSummary summary={summary} />
      <WatchtowerToolbar
        view={view}
        onViewChange={setView}
        filter={filter}
        onFilterChange={setFilter}
        summary={summary}
      />

      {visibleScans.length === 0 ? (
        <p className="text-sm opacity-60 py-4">{t("watchtower.empty")}</p>
      ) : view === "cards" ? (
        <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
          {visibleScans.map((scan) => (
            <WatchtowerCard key={scan.uuid} scan={scan} onSelect={selectScan} />
          ))}
        </div>
      ) : (
        <WatchtowerTable scans={visibleScans} onSelect={selectScan} />
      )}

      {selectedScan ? (
        // Keyed by scan so switching cards remounts the dialog: the draft review
        // note is local state and must not survive into a different subdomain.
        <WatchtowerDetail
          key={selectedScan.uuid}
          scan={selectedScan}
          onClose={closeDetail}
          onSubmitReview={submitReview}
        />
      ) : null}
    </div>
  );
}
