import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { AdminWatchtowerScan } from "@/api/admin-api";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { WatchtowerTable } from "./watchtower-table";

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

const flagged = scan({
  uuid: "s2",
  label: "swift-gecko",
  category: "MALICIOUS",
  riskLevel: "HIGH",
  summary: "Crypto scam pattern",
  visitedPaths: ["/", "/wallet", "/claim", "/bonus"],
});

describe("WatchtowerTable", () => {
  it("renders a row per scan with its verdict", () => {
    render(<WatchtowerTable scans={[scan({}), flagged]} onSelect={vi.fn()} />);

    expect(screen.getByText("rich-crane")).toBeVisible();
    expect(screen.getByText("swift-gecko")).toBeVisible();
    expect(screen.getByText("Crypto scam pattern")).toBeVisible();
  });

  it("shows a category badge per row", () => {
    render(<WatchtowerTable scans={[scan({}), flagged]} onSelect={vi.fn()} />);

    expect(screen.getByTestId("watchtower-badge-COSY_FRONTEND")).toBeVisible();
    expect(screen.getByTestId("watchtower-badge-MALICIOUS")).toBeVisible();
  });

  it("truncates a long path list and reports the remainder", () => {
    render(<WatchtowerTable scans={[flagged]} onSelect={vi.fn()} />);

    expect(screen.getByText("/ · /wallet · /claim +1")).toBeVisible();
  });

  it("selects the scan behind a clicked row", async () => {
    const onSelect = vi.fn();
    render(<WatchtowerTable scans={[flagged]} onSelect={onSelect} />);

    await userEvent.click(screen.getByText("swift-gecko"));

    expect(onSelect).toHaveBeenCalledWith("s2");
  });

  it("sorts by every column header without losing rows", async () => {
    const rows = [scan({}), flagged];
    render(<WatchtowerTable scans={rows} onSelect={vi.fn()} />);

    for (const header of [
      "watchtower.colStatus",
      "watchtower.colSubdomain",
      "watchtower.colVerdict",
      "watchtower.colPaths",
      "watchtower.colReview",
      "watchtower.colScanned",
    ]) {
      await userEvent.click(screen.getByText(header));
      expect(screen.getByText("rich-crane")).toBeVisible();
      expect(screen.getByText("swift-gecko")).toBeVisible();
    }
  });

  it("orders subdomains alphabetically when sorted by label", async () => {
    render(<WatchtowerTable scans={[flagged, scan({})]} onSelect={vi.fn()} />);

    await userEvent.click(screen.getByText("watchtower.colSubdomain"));

    const labels = screen
      .getAllByText(/rich-crane|swift-gecko/)
      .map((n) => n.textContent);
    expect(labels).toEqual(["rich-crane", "swift-gecko"]);
  });

  it("renders an empty message when there is nothing to show", () => {
    render(<WatchtowerTable scans={[]} onSelect={vi.fn()} />);

    expect(screen.getByText("watchtower.empty")).toBeVisible();
  });
});
