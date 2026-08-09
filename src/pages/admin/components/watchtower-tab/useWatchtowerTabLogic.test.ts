import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
  AdminWatchtowerScan,
  AdminWatchtowerSummary,
} from "@/api/admin-api";

// Stable identity on purpose: the hook's load effect lists `t` in its deps, so a
// mock that returns a fresh object per render would refetch on every render and
// make the call-order assertions below meaningless.
const translation = { t: (key: string) => key };
vi.mock("react-i18next", () => ({
  useTranslation: () => translation,
}));

const getWatchtowerScans = vi.fn();
const getWatchtowerSummary = vi.fn();
const updateWatchtowerReview = vi.fn();

vi.mock("@/api/admin-api", () => ({
  adminApi: {
    getWatchtowerScans: (...args: unknown[]) => getWatchtowerScans(...args),
    getWatchtowerSummary: (...args: unknown[]) => getWatchtowerSummary(...args),
    updateWatchtowerReview: (...args: unknown[]) =>
      updateWatchtowerReview(...args),
  },
}));

import { useWatchtowerTabLogic } from "./useWatchtowerTabLogic";

function scan(overrides: Partial<AdminWatchtowerScan>): AdminWatchtowerScan {
  return {
    uuid: "s1",
    subdomainUuid: "sd1",
    label: "rich-crane",
    fqdn: "rich-crane.play.cosy-hosting.net",
    ownerUuid: "u1",
    ownerUsername: "alice",
    scannedAt: "2026-08-09T03:12:00Z",
    reachable: true,
    httpStatus: 200,
    category: "COSY_FRONTEND",
    riskLevel: "NONE",
    summary: "COSY frontend detected",
    visitedPaths: ["/"],
    screenshotUrl: null,
    modelId: "claude-haiku-4-5-20251001",
    reviewStatus: "PENDING",
    reviewNote: null,
    reviewedAt: null,
    ...overrides,
  };
}

const cosyScan = scan({});
const flaggedScan = scan({
  uuid: "s2",
  label: "swift-gecko",
  category: "MALICIOUS",
  riskLevel: "HIGH",
});

const summary: AdminWatchtowerSummary = {
  totalSubdomains: 3,
  scannedSubdomains: 2,
  cosyFrontends: 1,
  benign: 0,
  flagged: 1,
  unreachable: 0,
  pendingReview: 1,
  lastScanAt: "2026-08-09T03:12:00Z",
};

beforeEach(() => {
  vi.clearAllMocks();
  getWatchtowerScans.mockResolvedValue([cosyScan, flaggedScan]);
  getWatchtowerSummary.mockResolvedValue(summary);
});

describe("useWatchtowerTabLogic", () => {
  it("loads scans and summary together", async () => {
    const { result } = renderHook(() => useWatchtowerTabLogic("key"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.scans).toHaveLength(2);
    expect(result.current.summary).toEqual(summary);
    expect(result.current.error).toBeNull();
  });

  it("sorts flagged scans ahead of clean ones", async () => {
    const { result } = renderHook(() => useWatchtowerTabLogic("key"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.visibleScans[0]?.uuid).toBe("s2");
  });

  it("filters down to the selected category", async () => {
    const { result } = renderHook(() => useWatchtowerTabLogic("key"));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.setFilter("cosy"));

    expect(result.current.visibleScans.map((s) => s.uuid)).toEqual(["s1"]);
  });

  it("exposes the selected scan and clears it again", async () => {
    const { result } = renderHook(() => useWatchtowerTabLogic("key"));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.selectScan("s2"));
    expect(result.current.selectedScan?.label).toBe("swift-gecko");

    act(() => result.current.closeDetail());
    expect(result.current.selectedScan).toBeNull();
  });

  it("replaces the reviewed scan and refetches the summary", async () => {
    const reviewed = { ...flaggedScan, reviewStatus: "DISMISSED" as const };
    updateWatchtowerReview.mockResolvedValue(reviewed);
    const afterReview = { ...summary, pendingReview: 0 };
    getWatchtowerSummary
      .mockResolvedValueOnce(summary)
      .mockResolvedValueOnce(afterReview);

    const { result } = renderHook(() => useWatchtowerTabLogic("key"));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await result.current.submitReview("s2", "DISMISSED", "  not a scam  ");

    // The pending counter is derived from review status, so it is stale the moment
    // a decision lands — the refetch is what keeps the header honest.
    await waitFor(() => expect(result.current.summary?.pendingReview).toBe(0));
    expect(
      result.current.scans.find((s) => s.uuid === "s2")?.reviewStatus,
    ).toBe("DISMISSED");
  });

  it("trims the review note and omits it when empty", async () => {
    updateWatchtowerReview.mockResolvedValue(flaggedScan);
    const { result } = renderHook(() => useWatchtowerTabLogic("key"));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await result.current.submitReview("s2", "ACKNOWLEDGED", "   ");

    await waitFor(() =>
      expect(updateWatchtowerReview).toHaveBeenCalledWith("key", "s2", {
        reviewStatus: "ACKNOWLEDGED",
        reviewNote: undefined,
      }),
    );
  });

  it("surfaces a load failure instead of an empty dashboard", async () => {
    getWatchtowerScans.mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() => useWatchtowerTabLogic("key"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe("watchtower.loadError");
    expect(result.current.scans).toHaveLength(0);
  });
});
