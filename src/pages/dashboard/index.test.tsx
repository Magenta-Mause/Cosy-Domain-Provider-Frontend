import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { SubdomainDto } from "@/api/generated/model";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, ...rest }: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a {...rest}>{children}</a>
  ),
  useNavigate: () => mockNavigate,
}));

vi.mock("@/components/layout/page-header", () => ({
  PageHeader: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="page-header">{children}</div>
  ),
}));

vi.mock("@/hooks/useAuthInformation/useAuthInformation", () => ({
  default: () => ({ maxSubdomainCount: 3, userTier: "FREE" }),
}));

const baseSub: SubdomainDto = {
  uuid: "s1",
  label: "castle",
  fqdn: "castle.play.cosy-hosting.net",
  targetIp: "192.0.2.1",
  status: "ACTIVE",
  labelMode: "CUSTOM",
  createdAt: "2026-01-01T00:00:00Z",
};

const defaultLogic = {
  subdomains: [baseSub],
  isLoading: false,
  isError: false,
  isVerified: true,
  isMfaEnabled: true,
  userTier: "FREE" as const,
  isSlotsExhausted: false,
  domainCreationEnabled: true,
  handleCreateNew: vi.fn(),
};

let mockLogic = { ...defaultLogic };

vi.mock("./useDashboardLogic", () => ({
  useDashboardLogic: () => mockLogic,
}));

import { DashboardPage } from "./index";

beforeEach(() => {
  vi.clearAllMocks();
  mockLogic = { ...defaultLogic };
});

describe("DashboardPage", () => {
  it("renders the banner, pricing card and subdomain list", () => {
    render(<DashboardPage />);
    expect(screen.getByTestId("page-header")).toBeInTheDocument();
    expect(
      screen.getByText(/dashboard.planCardSubdomains/),
    ).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-domain-item-s1")).toBeInTheDocument();
    expect(
      screen.getByText("castle.play.cosy-hosting.net"),
    ).toBeInTheDocument();
  });

  it("navigates to the domain on list item click", async () => {
    render(<DashboardPage />);
    await userEvent.click(screen.getByTestId("dashboard-domain-item-s1"));
    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/domain/$domainId",
      params: { domainId: "s1" },
    });
  });

  it("shows a loader while loading", () => {
    mockLogic = { ...defaultLogic, subdomains: [], isLoading: true };
    render(<DashboardPage />);
    expect(
      screen.queryByTestId("dashboard-domain-item-s1"),
    ).not.toBeInTheDocument();
  });

  it("shows the load error state", () => {
    mockLogic = { ...defaultLogic, subdomains: [], isError: true };
    render(<DashboardPage />);
    expect(screen.getByText(/dashboard.loadError/)).toBeInTheDocument();
  });

  it("shows the verified empty state", () => {
    mockLogic = { ...defaultLogic, subdomains: [] };
    render(<DashboardPage />);
    expect(screen.getByText("dashboard.empty")).toBeInTheDocument();
  });

  it("asks for MFA setup when verified without MFA", () => {
    mockLogic = { ...defaultLogic, subdomains: [], isMfaEnabled: false };
    render(<DashboardPage />);
    expect(screen.getByText("dashboard.emptyMfaRequired")).toBeInTheDocument();
  });

  it("shows the unverified empty state", () => {
    mockLogic = {
      ...defaultLogic,
      subdomains: [],
      isVerified: false,
      isMfaEnabled: false,
    };
    render(<DashboardPage />);
    expect(screen.getByText("dashboard.emptyUnverified")).toBeInTheDocument();
  });
});
