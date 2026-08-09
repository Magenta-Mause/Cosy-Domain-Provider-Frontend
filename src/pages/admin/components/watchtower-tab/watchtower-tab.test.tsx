import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
  AdminWatchtowerScan,
  AdminWatchtowerSummary,
} from "@/api/admin-api";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

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

const flaggedScan = scan({
  uuid: "s2",
  label: "swift-gecko",
  category: "MALICIOUS",
  riskLevel: "HIGH",
  summary: "Crypto scam pattern",
});

const defaultLogic = {
  isLoading: false,
  error: null as string | null,
  summary,
  scans: [scan({}), flaggedScan],
  visibleScans: [flaggedScan, scan({})],
  view: "cards" as const,
  setView: vi.fn(),
  filter: "all" as const,
  setFilter: vi.fn(),
  selectedScan: null as AdminWatchtowerScan | null,
  selectScan: vi.fn(),
  closeDetail: vi.fn(),
  submitReview: vi.fn(),
};

let mockLogic = { ...defaultLogic };

vi.mock("./useWatchtowerTabLogic", () => ({
  useWatchtowerTabLogic: () => mockLogic,
}));

import { WatchtowerTab } from "./watchtower-tab";

beforeEach(() => {
  vi.clearAllMocks();
  mockLogic = { ...defaultLogic };
});

describe("WatchtowerTab", () => {
  it("renders a card per visible scan", () => {
    render(<WatchtowerTab adminKey="key" />);
    expect(screen.getByTestId("watchtower-card-swift-gecko")).toBeVisible();
    expect(screen.getByTestId("watchtower-card-rich-crane")).toBeVisible();
  });

  it("marks a flagged pending scan as needing review", () => {
    render(<WatchtowerTab adminKey="key" />);
    const flaggedCard = screen.getByTestId("watchtower-card-swift-gecko");
    expect(flaggedCard).toHaveTextContent("watchtower.needsReview");
  });

  it("does not mark a clean scan as needing review", () => {
    render(<WatchtowerTab adminKey="key" />);
    const cleanCard = screen.getByTestId("watchtower-card-rich-crane");
    expect(cleanCard).not.toHaveTextContent("watchtower.needsReview");
  });

  it("selects a scan when its card is clicked", async () => {
    render(<WatchtowerTab adminKey="key" />);
    await userEvent.click(screen.getByTestId("watchtower-card-swift-gecko"));
    expect(mockLogic.selectScan).toHaveBeenCalledWith("s2");
  });

  it("switches to the list view", async () => {
    render(<WatchtowerTab adminKey="key" />);
    await userEvent.click(screen.getByTestId("watchtower-view-list"));
    expect(mockLogic.setView).toHaveBeenCalledWith("list");
  });

  it("applies a filter", async () => {
    render(<WatchtowerTab adminKey="key" />);
    await userEvent.click(screen.getByTestId("watchtower-filter-flagged"));
    expect(mockLogic.setFilter).toHaveBeenCalledWith("flagged");
  });

  it("shows the detail dialog for the selected scan", () => {
    mockLogic = { ...defaultLogic, selectedScan: flaggedScan };
    render(<WatchtowerTab adminKey="key" />);
    expect(screen.getByTestId("watchtower-detail")).toBeVisible();
    expect(screen.getByTestId("watchtower-detail")).toHaveTextContent(
      "Crypto scam pattern",
    );
  });

  it("renders the error instead of the grid when loading failed", () => {
    mockLogic = { ...defaultLogic, error: "boom" };
    render(<WatchtowerTab adminKey="key" />);
    expect(screen.getByText("boom")).toBeVisible();
    expect(
      screen.queryByTestId("watchtower-card-swift-gecko"),
    ).not.toBeInTheDocument();
  });

  it("shows an empty state when the filter matches nothing", () => {
    mockLogic = { ...defaultLogic, visibleScans: [] };
    render(<WatchtowerTab adminKey="key" />);
    expect(screen.getByText("watchtower.empty")).toBeVisible();
  });
});
