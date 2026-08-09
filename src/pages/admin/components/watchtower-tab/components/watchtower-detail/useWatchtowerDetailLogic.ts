import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import type {
  AdminWatchtowerScan,
  WatchtowerReviewStatus,
} from "@/api/admin-api";

interface UseWatchtowerDetailLogicArgs {
  readonly scan: AdminWatchtowerScan;
  readonly onSubmitReview: (
    uuid: string,
    status: WatchtowerReviewStatus,
    note: string,
  ) => Promise<AdminWatchtowerScan>;
  readonly onClose: () => void;
}

export function useWatchtowerDetailLogic({
  scan,
  onSubmitReview,
  onClose,
}: UseWatchtowerDetailLogicArgs) {
  const { t } = useTranslation("admin");
  const { reviewNote } = scan;
  const [note, setNote] = useState(reviewNote ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Selecting a different card reuses this component, so the draft note has to
  // follow the scan rather than stick to whatever was typed for the previous one.
  // Also picks up the persisted note after a successful save.
  useEffect(() => {
    setNote(reviewNote ?? "");
    setSaveError(null);
  }, [reviewNote]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const decide = async (status: WatchtowerReviewStatus) => {
    setIsSaving(true);
    setSaveError(null);
    try {
      await onSubmitReview(scan.uuid, status, note);
    } catch {
      setSaveError(t("watchtower.reviewError"));
    } finally {
      setIsSaving(false);
    }
  };

  return { note, setNote, isSaving, saveError, decide };
}
