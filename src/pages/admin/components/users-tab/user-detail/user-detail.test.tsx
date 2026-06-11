import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AdminUserDetail } from "@/api/admin-api";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockLogic = {
  overrideInput: "",
  setOverrideInput: vi.fn(),
  isSaving: false,
  saveError: null as string | null,
  isUnchanged: true,
  handleSaveOverride: vi.fn(),
  username: "alice",
  setUsername: vi.fn(),
  email: "alice@example.com",
  setEmail: vi.fn(),
  isSavingUser: false,
  saveUserError: null as string | null,
  isUserUnchanged: true,
  handleSaveUser: vi.fn(),
  isDeleting: false,
  deleteError: null as string | null,
  handleDeleteUser: vi.fn(),
  handleBack: vi.fn(),
  handleSubdomainClick: vi.fn(),
};

vi.mock("./useUserDetailLogic", () => ({
  useUserDetailLogic: () => mockLogic,
}));

import { UserDetail } from "./user-detail";

const detail: AdminUserDetail = {
  uuid: "u1",
  username: "alice",
  email: "alice@example.com",
  verified: true,
  tier: "PLUS",
  maxSubdomainCount: 5,
  maxSubdomainCountOverride: 10,
  planExpiresAt: "2027-01-01T00:00:00Z",
  createdAt: "2026-01-01T00:00:00Z",
  subdomains: [
    {
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
      createdAt: "2026-01-02T00:00:00Z",
      updatedAt: "2026-01-02T00:00:00Z",
    },
  ],
};

function renderDetail() {
  return render(
    <UserDetail detail={detail} adminKey="key" onSaved={vi.fn()} />,
  );
}

beforeEach(() => vi.clearAllMocks());

describe("UserDetail", () => {
  it("renders the user info and override marker", () => {
    renderDetail();
    expect(screen.getByText("u1")).toBeInTheDocument();
    expect(screen.getByText("PLUS")).toBeInTheDocument();
    expect(screen.getByText("admin.yes")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("lists the user's subdomains with status", () => {
    renderDetail();
    expect(screen.getByText("castle")).toBeInTheDocument();
    expect(screen.getByText("ACTIVE")).toBeInTheDocument();
  });

  it("notifies on subdomain row click", async () => {
    renderDetail();
    await userEvent.click(screen.getByText("castle"));
    expect(mockLogic.handleSubdomainClick).toHaveBeenCalledWith("s1");
  });

  it("triggers delete from the danger zone", async () => {
    renderDetail();
    await userEvent.click(screen.getByText("admin.deleteUser"));
    expect(mockLogic.handleDeleteUser).toHaveBeenCalled();
  });

  it("goes back via the back button", async () => {
    renderDetail();
    await userEvent.click(screen.getByText("admin.back"));
    expect(mockLogic.handleBack).toHaveBeenCalled();
  });
});
