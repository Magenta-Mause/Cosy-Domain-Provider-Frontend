import type {
  AdminWatchtowerScan,
  WatchtowerCategory,
  WatchtowerReviewStatus,
} from "@/api/admin-api";

/** Which chip in the filter row is active. `all` shows every scan. */
export type WatchtowerFilter =
  | "all"
  | "cosy"
  | "benign"
  | "empty"
  | "flagged"
  | "offline";

export type WatchtowerView = "cards" | "list";

/**
 * Categories that threaten the parent domain's reputation. Kept in sync with
 * `WatchtowerService.FLAGGED_CATEGORIES` on the backend — the dashboard's "flagged"
 * count must mean the same thing as the summary endpoint's.
 */
const FLAGGED_CATEGORIES: readonly WatchtowerCategory[] = [
  "SUSPICIOUS",
  "MALICIOUS",
];

export function isFlagged(scan: AdminWatchtowerScan): boolean {
  return FLAGGED_CATEGORIES.includes(scan.category);
}

/** Tailwind token classes per category, used for card borders and badges. */
export function categoryAccent(category: WatchtowerCategory): {
  border: string;
  badge: string;
  text: string;
} {
  switch (category) {
    case "COSY_FRONTEND":
      return {
        border: "border-foreground",
        badge: "bg-accent-3 text-paper",
        text: "text-foreground",
      };
    case "BENIGN":
      return {
        border: "border-foreground",
        badge: "bg-success text-paper",
        text: "text-foreground",
      };
    case "EMPTY":
      return {
        border: "border-foreground",
        badge: "bg-muted text-paper",
        text: "text-foreground",
      };
    case "SUSPICIOUS":
      return {
        border: "border-accent",
        badge: "bg-accent text-foreground",
        text: "text-foreground",
      };
    case "MALICIOUS":
      return {
        border: "border-destructive",
        badge: "bg-destructive text-paper",
        text: "text-destructive",
      };
    case "UNREACHABLE":
      return {
        border: "border-foreground",
        badge: "bg-foreground text-paper",
        text: "text-foreground",
      };
  }
}

export function matchesFilter(
  scan: AdminWatchtowerScan,
  filter: WatchtowerFilter,
): boolean {
  switch (filter) {
    case "all":
      return true;
    case "cosy":
      return scan.category === "COSY_FRONTEND";
    case "benign":
      return scan.category === "BENIGN";
    case "empty":
      return scan.category === "EMPTY";
    case "flagged":
      return isFlagged(scan);
    case "offline":
      return scan.category === "UNREACHABLE";
  }
}

/**
 * Flagged scans first, then unresolved before resolved, then newest first. An admin
 * opening the tab should land on what still needs a decision without touching a filter.
 */
export function compareScans(
  a: AdminWatchtowerScan,
  b: AdminWatchtowerScan,
): number {
  const byFlag = Number(isFlagged(b)) - Number(isFlagged(a));
  if (byFlag !== 0) return byFlag;

  const byPending =
    Number(b.reviewStatus === "PENDING") - Number(a.reviewStatus === "PENDING");
  if (byPending !== 0) return byPending;

  return new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime();
}

/** `/ · /login · /servers`, truncated so a long crawl does not blow up the card. */
export function formatPaths(paths: string[], max = 3): string {
  if (paths.length === 0) return "—";
  const shown = paths.slice(0, max).join(" · ");
  return paths.length > max ? `${shown} +${paths.length - max}` : shown;
}

/** A flagged scan nobody has decided on yet is what the "needs review" pill counts. */
export function needsReview(scan: AdminWatchtowerScan): boolean {
  return isFlagged(scan) && scan.reviewStatus === "PENDING";
}

export const REVIEW_STATUSES: readonly WatchtowerReviewStatus[] = [
  "PENDING",
  "ACKNOWLEDGED",
  "DISMISSED",
  "ACTIONED",
];
