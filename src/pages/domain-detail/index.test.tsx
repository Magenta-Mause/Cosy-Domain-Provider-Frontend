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

vi.mock("@/components/layout/app-header", () => ({
  AppHeader: () => <div data-testid="app-header" />,
}));

const baseDomain: SubdomainDto = {
  uuid: "s1",
  label: "castle",
  fqdn: "castle.play.cosy-hosting.net",
  targetIp: "192.0.2.1",
  status: "ACTIVE",
  labelMode: "CUSTOM",
  createdAt: "2026-01-01T00:00:00Z",
  dnsEntries: [
    {
      name: "castle.play.cosy-hosting.net",
      type: "A",
      ttl: 300,
      values: ["192.0.2.1"],
    },
  ],
};

const defaultLogic = {
  domain: baseDomain as SubdomainDto | undefined,
  isCreateMode: false,
  isPlus: true,
  isVerified: true,
  isInitialLoading: false,
  label: "castle",
  setLabel: vi.fn(),
  targetIp: "192.0.2.1",
  setTargetIp: vi.fn(),
  targetIpv6: "",
  setTargetIpv6: vi.fn(),
  ipTab: "ipv4" as const,
  setIpTab: vi.fn(),
  errorMessage: null as string | null,
  isSubmitting: false,
  isDeleting: false,
  hasSubmitted: false,
  activeTab: "overview" as string,
  setActiveTab: vi.fn(),
  labelValid: true,
  labelAvailability: "available" as string,
  namingMode: "custom" as string,
  setNamingMode: vi.fn(),
  ipValid: true,
  ipv4Valid: true,
  ipv6Valid: true,
  atLeastOneIp: true,
  canSubmit: true,
  createdAt: "1/1/2026",
  handleSubmit: vi.fn((e: React.SyntheticEvent) => e.preventDefault()),
  handleDelete: vi.fn(),
};

let mockLogic = { ...defaultLogic };

vi.mock("./useDomainDetailLogic", () => ({
  useDomainDetailLogic: () => mockLogic,
}));

import { DomainDetailPage } from "./index";

beforeEach(() => {
  vi.clearAllMocks();
  mockLogic = { ...defaultLogic };
});

describe("DomainDetailPage", () => {
  it("shows a loader during initial load", () => {
    mockLogic = { ...defaultLogic, isInitialLoading: true };
    render(<DomainDetailPage domainId="s1" />);
    expect(screen.getByTestId("app-header")).toBeInTheDocument();
    expect(
      screen.queryByTestId("domain-detail-tab-overview-btn"),
    ).not.toBeInTheDocument();
  });

  it("renders the overview tab with tab bar in edit mode", () => {
    render(<DomainDetailPage domainId="s1" />);
    expect(
      screen.getByTestId("domain-detail-tab-overview-btn"),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/castle/).length).toBeGreaterThan(0);
  });

  it("switches tabs via the tab bar", async () => {
    render(<DomainDetailPage domainId="s1" />);
    await userEvent.click(screen.getByTestId("domain-detail-tab-dns-btn"));
    expect(mockLogic.setActiveTab).toHaveBeenCalledWith("dns");
  });

  it("renders the DNS tab with entries", () => {
    mockLogic = { ...defaultLogic, activeTab: "dns" };
    render(<DomainDetailPage domainId="s1" />);
    expect(screen.getAllByText("192.0.2.1").length).toBeGreaterThan(0);
  });

  it("renders the danger tab and triggers delete", async () => {
    mockLogic = { ...defaultLogic, activeTab: "danger" };
    render(<DomainDetailPage domainId="s1" />);
    await userEvent.click(screen.getByTestId("domain-detail-delete-btn"));
    expect(mockLogic.handleDelete).toHaveBeenCalled();
  });

  it("renders the create form in create mode for PLUS users", () => {
    mockLogic = {
      ...defaultLogic,
      isCreateMode: true,
      domain: undefined,
      label: "",
    };
    render(<DomainDetailPage domainId="new" />);
    expect(
      screen.queryByTestId("domain-detail-tab-overview-btn"),
    ).not.toBeInTheDocument();
  });

  it("renders the create form in random mode for FREE users", () => {
    mockLogic = {
      ...defaultLogic,
      isCreateMode: true,
      isPlus: false,
      namingMode: "random",
      domain: undefined,
      label: "",
    };
    render(<DomainDetailPage domainId="new" />);
    expect(
      screen.queryByTestId("domain-detail-tab-overview-btn"),
    ).not.toBeInTheDocument();
  });
});
