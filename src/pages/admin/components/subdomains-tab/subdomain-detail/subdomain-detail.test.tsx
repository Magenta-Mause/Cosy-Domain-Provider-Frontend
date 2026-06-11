import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AdminSubdomain } from "@/api/admin-api";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockLogic = {
  domainSuffix: ".play.cosy-hosting.net",
  targetIp: "192.0.2.1",
  setTargetIp: vi.fn(),
  targetIpv6: "",
  setTargetIpv6: vi.fn(),
  isSavingIps: false,
  saveIpsError: null as string | null,
  ipsUnchanged: true,
  handleSaveIps: vi.fn(),
  label: "castle",
  setLabel: vi.fn(),
  isSavingLabel: false,
  saveLabelError: null as string | null,
  labelUnchanged: true,
  handleSaveLabel: vi.fn(),
  isDeleting: false,
  deleteError: null as string | null,
  handleDeleteSubdomain: vi.fn(),
  handleBack: vi.fn(),
  handleOwnerClick: vi.fn(),
};

vi.mock("./useSubdomainDetailLogic", () => ({
  useSubdomainDetailLogic: () => mockLogic,
}));

import { SubdomainDetail } from "./subdomain-detail";

const subdomain: AdminSubdomain = {
  uuid: "s1",
  label: "castle",
  fqdn: "castle.play.cosy-hosting.net",
  targetIp: "192.0.2.1",
  targetIpv6: "2001:db8::1",
  status: "ACTIVE",
  labelMode: "CUSTOM",
  ownerUuid: "owner-1",
  ownerUsername: "alice",
  ownerEmail: "alice@example.com",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-02T00:00:00Z",
};

function renderDetail(sub: AdminSubdomain = subdomain) {
  return render(
    <SubdomainDetail subdomain={sub} adminKey="key" onSaved={vi.fn()} />,
  );
}

beforeEach(() => vi.clearAllMocks());

describe("SubdomainDetail", () => {
  it("renders the info panels with owner and status", () => {
    renderDetail();
    expect(screen.getByText("s1")).toBeInTheDocument();
    expect(screen.getByText("ACTIVE")).toBeInTheDocument();
    expect(screen.getByText("alice")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("owner-1")).toBeInTheDocument();
  });

  it("derives DNS entries for both IP records", () => {
    renderDetail();
    expect(screen.getAllByText("192.0.2.1").length).toBeGreaterThan(0);
    expect(screen.getAllByText("2001:db8::1").length).toBeGreaterThan(0);
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("AAAA")).toBeInTheDocument();
  });

  it("shows the empty DNS message when no IPs are set", () => {
    renderDetail({ ...subdomain, targetIp: null, targetIpv6: null });
    expect(screen.getByText("admin.noDnsEntries")).toBeInTheDocument();
  });

  it("navigates to the owner on owner click", async () => {
    renderDetail();
    await userEvent.click(screen.getByText("owner-1"));
    expect(mockLogic.handleOwnerClick).toHaveBeenCalled();
  });

  it("goes back via the back button", async () => {
    renderDetail();
    await userEvent.click(screen.getByText("admin.back"));
    expect(mockLogic.handleBack).toHaveBeenCalled();
  });

  it("triggers delete from the danger zone", async () => {
    renderDetail();
    await userEvent.click(screen.getByText("admin.deleteSubdomain"));
    expect(mockLogic.handleDeleteSubdomain).toHaveBeenCalled();
  });
});
