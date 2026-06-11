import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AdminSubdomain } from "@/api/admin-api";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const baseSub: AdminSubdomain = {
  uuid: "s1",
  label: "castle",
  fqdn: "castle.play.cosy-hosting.net",
  targetIp: "192.0.2.1",
  targetIpv6: null,
  status: "ACTIVE",
  labelMode: "CUSTOM",
  ownerUuid: "u1",
  ownerUsername: "alice",
  ownerEmail: "alice@example.com",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

const defaultTabLogic = {
  isLoading: false,
  error: null as string | null,
  subdomains: [baseSub],
  total: 1,
  failed: 0,
  handleSubdomainClick: vi.fn(),
};

let mockTabLogic = { ...defaultTabLogic };

vi.mock("./useSubdomainsTabLogic", () => ({
  useSubdomainsTabLogic: () => mockTabLogic,
}));

const defaultKillSwitchLogic = {
  domainCreationEnabled: true,
  isLoading: false,
  isToggling: false,
  toggle: vi.fn(),
};

let mockKillSwitchLogic = { ...defaultKillSwitchLogic };

vi.mock("./components/useKillSwitchLogic", () => ({
  useKillSwitchLogic: () => mockKillSwitchLogic,
}));

import { SubdomainsTab } from "./subdomains-tab";

beforeEach(() => {
  vi.clearAllMocks();
  mockTabLogic = { ...defaultTabLogic };
  mockKillSwitchLogic = { ...defaultKillSwitchLogic };
});

describe("SubdomainsTab", () => {
  it("renders kill switch, stats and table", () => {
    render(<SubdomainsTab adminKey="k" />);
    expect(screen.getByText("admin.killSwitchTitle")).toBeInTheDocument();
    expect(screen.getByText("castle")).toBeInTheDocument();
  });

  it("shows the loading state", () => {
    mockTabLogic = { ...defaultTabLogic, isLoading: true };
    render(<SubdomainsTab adminKey="k" />);
    expect(screen.getByText("admin.loading")).toBeInTheDocument();
  });

  it("shows the error state", () => {
    mockTabLogic = { ...defaultTabLogic, error: "boom" };
    render(<SubdomainsTab adminKey="k" />);
    expect(screen.getByText("boom")).toBeInTheDocument();
  });

  it("toggles the kill switch", async () => {
    render(<SubdomainsTab adminKey="k" />);
    await userEvent.click(screen.getByText("admin.killSwitchDisable"));
    expect(mockKillSwitchLogic.toggle).toHaveBeenCalled();
  });

  it("shows the enable label when creation is disabled", () => {
    mockKillSwitchLogic = {
      ...defaultKillSwitchLogic,
      domainCreationEnabled: false,
    };
    render(<SubdomainsTab adminKey="k" />);
    expect(screen.getByText("admin.killSwitchEnable")).toBeInTheDocument();
  });
});
