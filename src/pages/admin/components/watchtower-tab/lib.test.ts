import { describe, expect, it } from "vitest";

import type { AdminWatchtowerScan } from "@/api/admin-api";

import {
  categoryAccent,
  compareScans,
  formatPaths,
  isFlagged,
  matchesFilter,
  needsReview,
} from "./lib";

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
    visitedPaths: ["/", "/login"],
    screenshotUrl: null,
    modelId: "claude-haiku-4-5-20251001",
    reviewStatus: "PENDING",
    reviewNote: null,
    reviewedAt: null,
    ...overrides,
  };
}

describe("isFlagged", () => {
  it("flags suspicious and malicious", () => {
    expect(isFlagged(scan({ category: "SUSPICIOUS" }))).toBe(true);
    expect(isFlagged(scan({ category: "MALICIOUS" }))).toBe(true);
  });

  it("does not flag cosy, benign or unreachable", () => {
    expect(isFlagged(scan({ category: "COSY_FRONTEND" }))).toBe(false);
    expect(isFlagged(scan({ category: "BENIGN" }))).toBe(false);
    expect(isFlagged(scan({ category: "UNREACHABLE" }))).toBe(false);
  });
});

describe("matchesFilter", () => {
  it("all matches everything", () => {
    expect(matchesFilter(scan({ category: "MALICIOUS" }), "all")).toBe(true);
  });

  it("flagged matches both risk categories but not benign", () => {
    expect(matchesFilter(scan({ category: "SUSPICIOUS" }), "flagged")).toBe(
      true,
    );
    expect(matchesFilter(scan({ category: "BENIGN" }), "flagged")).toBe(false);
  });

  it("cosy only matches COSY frontends", () => {
    expect(matchesFilter(scan({ category: "COSY_FRONTEND" }), "cosy")).toBe(
      true,
    );
    expect(matchesFilter(scan({ category: "BENIGN" }), "cosy")).toBe(false);
  });

  it("offline only matches unreachable", () => {
    expect(matchesFilter(scan({ category: "UNREACHABLE" }), "offline")).toBe(
      true,
    );
    expect(matchesFilter(scan({ category: "BENIGN" }), "offline")).toBe(false);
  });
});

describe("compareScans", () => {
  it("puts flagged scans before clean ones", () => {
    const clean = scan({ uuid: "a", category: "BENIGN" });
    const flagged = scan({ uuid: "b", category: "MALICIOUS" });
    expect([clean, flagged].sort(compareScans).map((s) => s.uuid)).toEqual([
      "b",
      "a",
    ]);
  });

  it("puts undecided flagged scans before already-reviewed ones", () => {
    const reviewed = scan({
      uuid: "a",
      category: "MALICIOUS",
      reviewStatus: "DISMISSED",
    });
    const pending = scan({ uuid: "b", category: "MALICIOUS" });
    expect([reviewed, pending].sort(compareScans).map((s) => s.uuid)).toEqual([
      "b",
      "a",
    ]);
  });

  it("falls back to newest first", () => {
    const older = scan({ uuid: "a", scannedAt: "2026-08-01T03:00:00Z" });
    const newer = scan({ uuid: "b", scannedAt: "2026-08-09T03:00:00Z" });
    expect([older, newer].sort(compareScans).map((s) => s.uuid)).toEqual([
      "b",
      "a",
    ]);
  });
});

describe("formatPaths", () => {
  it("joins paths with a separator", () => {
    expect(formatPaths(["/", "/login"])).toBe("/ · /login");
  });

  it("truncates beyond the max and reports the remainder", () => {
    expect(formatPaths(["/", "/a", "/b", "/c", "/d"])).toBe("/ · /a · /b +2");
  });

  it("renders a dash for no paths", () => {
    expect(formatPaths([])).toBe("—");
  });
});

describe("categoryAccent", () => {
  it("gives every category a token-based accent", () => {
    for (const category of [
      "COSY_FRONTEND",
      "BENIGN",
      "EMPTY",
      "SUSPICIOUS",
      "MALICIOUS",
      "UNREACHABLE",
    ] as const) {
      const accent = categoryAccent(category);
      expect(accent.border).toMatch(/^border-/);
      expect(accent.badge).toMatch(/^bg-/);
      expect(accent.text).toMatch(/^text-/);
    }
  });

  it("marks only MALICIOUS in destructive colours", () => {
    // The border is what makes a risky card readable at a glance across the grid,
    // so it must not quietly become the same as every other card's.
    expect(categoryAccent("MALICIOUS").border).toBe("border-destructive");
    expect(categoryAccent("MALICIOUS").text).toBe("text-destructive");
    expect(categoryAccent("BENIGN").text).not.toBe("text-destructive");
    expect(categoryAccent("COSY_FRONTEND").border).toBe("border-foreground");
  });

  it("separates SUSPICIOUS from MALICIOUS visually", () => {
    expect(categoryAccent("SUSPICIOUS").badge).not.toBe(
      categoryAccent("MALICIOUS").badge,
    );
  });

  it("gives UNREACHABLE a neutral accent", () => {
    expect(categoryAccent("UNREACHABLE").border).toBe("border-foreground");
  });
});

describe("matchesFilter (benign / empty)", () => {
  it("benign matches only the BENIGN category", () => {
    expect(matchesFilter(scan({ category: "BENIGN" }), "benign")).toBe(true);
    expect(matchesFilter(scan({ category: "COSY_FRONTEND" }), "benign")).toBe(
      false,
    );
  });

  it("keeps EMPTY out of benign, offline and flagged", () => {
    // A parked subdomain is its own thing: counting it as OK overstates how much of
    // the estate is in use, counting it as offline overstates how much is broken.
    const parked = scan({ category: "EMPTY" });
    expect(matchesFilter(parked, "empty")).toBe(true);
    expect(matchesFilter(parked, "benign")).toBe(false);
    expect(matchesFilter(parked, "offline")).toBe(false);
    expect(matchesFilter(parked, "flagged")).toBe(false);
    expect(matchesFilter(parked, "all")).toBe(true);
  });

  it("does not treat EMPTY as a reputation risk", () => {
    expect(isFlagged(scan({ category: "EMPTY" }))).toBe(false);
    expect(needsReview(scan({ category: "EMPTY" }))).toBe(false);
  });
});

describe("needsReview", () => {
  it("is true only for flagged scans still pending", () => {
    expect(needsReview(scan({ category: "MALICIOUS" }))).toBe(true);
    expect(
      needsReview(scan({ category: "MALICIOUS", reviewStatus: "DISMISSED" })),
    ).toBe(false);
    expect(needsReview(scan({ category: "BENIGN" }))).toBe(false);
  });
});
