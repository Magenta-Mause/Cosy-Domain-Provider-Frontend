import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AdminUser } from "@/api/admin-api";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { UsersTable } from "./users-table";

const users: AdminUser[] = [
  {
    uuid: "u1",
    username: "alice",
    email: "alice@example.com",
    verified: true,
    tier: "PLUS",
    maxSubdomainCount: 5,
    maxSubdomainCountOverride: 10,
    subdomainCount: 2,
    planExpiresAt: "2027-01-01T00:00:00Z",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    uuid: "u2",
    username: "bob",
    email: "bob@example.com",
    verified: false,
    tier: "FREE",
    maxSubdomainCount: 1,
    maxSubdomainCountOverride: null,
    subdomainCount: 0,
    planExpiresAt: null,
    createdAt: null,
  },
];

const onUserClick = vi.fn();

beforeEach(() => vi.clearAllMocks());

describe("UsersTable", () => {
  it("renders one row per user", () => {
    render(<UsersTable users={users} onUserClick={onUserClick} />);
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("bob@example.com")).toBeInTheDocument();
    expect(screen.getByText("PLUS")).toBeInTheDocument();
    expect(screen.getByText("admin.yes")).toBeInTheDocument();
    expect(screen.getByText("admin.no")).toBeInTheDocument();
  });

  it("notifies on row click with the user uuid", async () => {
    render(<UsersTable users={users} onUserClick={onUserClick} />);
    await userEvent.click(screen.getByText("alice@example.com"));
    expect(onUserClick).toHaveBeenCalledWith("u1");
  });

  it("sorts by every sortable column without crashing", async () => {
    render(<UsersTable users={users} onUserClick={onUserClick} />);
    for (const header of [
      "admin.colEmail",
      "admin.colUuid",
      "admin.colTier",
      "admin.colSubdomains",
      "admin.colVerified",
      "admin.colPlanExpires",
    ]) {
      await userEvent.click(screen.getByText(header));
      await userEvent.click(screen.getByText(header)); // both directions
    }
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
  });
});
