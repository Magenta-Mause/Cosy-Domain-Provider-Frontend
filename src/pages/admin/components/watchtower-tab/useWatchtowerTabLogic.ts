import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  type AdminWatchtowerScan,
  type AdminWatchtowerSummary,
  adminApi,
  type WatchtowerReviewStatus,
} from "@/api/admin-api";

import {
  compareScans,
  matchesFilter,
  type WatchtowerFilter,
  type WatchtowerView,
} from "./lib";

export function useWatchtowerTabLogic(adminKey: string) {
  const { t } = useTranslation("admin");
  const [scans, setScans] = useState<AdminWatchtowerScan[]>([]);
  const [summary, setSummary] = useState<AdminWatchtowerSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<WatchtowerView>("cards");
  const [filter, setFilter] = useState<WatchtowerFilter>("all");
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      adminApi.getWatchtowerScans(adminKey),
      adminApi.getWatchtowerSummary(adminKey),
    ])
      .then(([loadedScans, loadedSummary]) => {
        setScans(loadedScans);
        setSummary(loadedSummary);
        setError(null);
      })
      .catch(() => setError(t("watchtower.loadError")))
      .finally(() => setIsLoading(false));
  }, [adminKey, t]);

  const visibleScans = useMemo(
    () => scans.filter((s) => matchesFilter(s, filter)).sort(compareScans),
    [scans, filter],
  );

  const selectedScan = useMemo(
    () => scans.find((s) => s.uuid === selectedUuid) ?? null,
    [scans, selectedUuid],
  );

  const submitReview = useCallback(
    async (uuid: string, status: WatchtowerReviewStatus, note: string) => {
      const updated = await adminApi.updateWatchtowerReview(adminKey, uuid, {
        reviewStatus: status,
        reviewNote: note.trim() === "" ? undefined : note.trim(),
      });
      setScans((current) =>
        current.map((s) => (s.uuid === updated.uuid ? updated : s)),
      );
      // The pending-review counter is derived from review status, so it goes stale
      // the moment a decision lands. Refetching keeps the header honest.
      setSummary(await adminApi.getWatchtowerSummary(adminKey));
      return updated;
    },
    [adminKey],
  );

  return {
    isLoading,
    error,
    summary,
    scans,
    visibleScans,
    view,
    setView,
    filter,
    setFilter,
    selectedScan,
    selectScan: setSelectedUuid,
    closeDetail: () => setSelectedUuid(null),
    submitReview,
  };
}
