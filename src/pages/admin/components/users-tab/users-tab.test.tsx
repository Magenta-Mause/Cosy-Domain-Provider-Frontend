import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AdminUser } from "@/api/admin-api";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const baseUser: AdminUser = {
  uuid: "u1",
  username: "alice",
  email: "alice@example.com",
  verified: true,
  tier: "FREE",
  maxSubdomainCount: 3,
  maxSubdomainCountOverride: null,
  subdomainCount: 1,
  planExpiresAt: null,
  createdAt: "2026-01-01T00:00:00Z",
};

const defaultLogic = {
  users: [baseUser],
  isLoading: false,
  error: null as string | null,
  total: 1,
  unverified: 0,
  plus: 0,
  handleUserClick: vi.fn(),
};

let mockLogic = { ...defaultLogic };

vi.mock("./useUsersTabLogic", () => ({
  useUsersTabLogic: () => mockLogic,
}));

import { UsersTab } from "./users-tab";

beforeEach(() => {
  vi.clearAllMocks();
  mockLogic = { ...defaultLogic };
});

describe("UsersTab", () => {
  it("renders stats and the users table", () => {
    render(<UsersTab adminKey="k" />);
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
  });

  it("shows the loading state", () => {
    mockLogic = { ...defaultLogic, isLoading: true };
    render(<UsersTab adminKey="k" />);
    expect(screen.getByText("admin.loading")).toBeInTheDocument();
  });

  it("shows the error state", () => {
    mockLogic = { ...defaultLogic, error: "boom" };
    render(<UsersTab adminKey="k" />);
    expect(screen.getByText("boom")).toBeInTheDocument();
  });
});
