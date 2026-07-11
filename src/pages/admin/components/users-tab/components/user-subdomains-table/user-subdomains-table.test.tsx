import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { AdminSubdomain } from "@/api/admin-api";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { UserSubdomainsTable } from "./user-subdomains-table";

const baseSub: AdminSubdomain = {
  uuid: "sub-1",
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
  updatedAt: "2026-01-02T00:00:00Z",
};

describe("UserSubdomainsTable", () => {
  it("renders a row for each subdomain with label, fqdn, status and mode", () => {
    render(
      <UserSubdomainsTable subdomains={[baseSub]} onSubdomainClick={vi.fn()} />,
    );

    expect(screen.getByText("castle")).toBeInTheDocument();
    expect(
      screen.getByText("castle.play.cosy-hosting.net"),
    ).toBeInTheDocument();
    expect(screen.getByText("ACTIVE")).toBeInTheDocument();
    expect(screen.getByText("CUSTOM")).toBeInTheDocument();
    expect(screen.getByText("192.0.2.1")).toBeInTheDocument();
  });

  it("falls back to em-dash for missing fqdn and targetIp", () => {
    render(
      <UserSubdomainsTable
        subdomains={[{ ...baseSub, fqdn: null, targetIp: null }]}
        onSubdomainClick={vi.fn()}
      />,
    );

    expect(screen.getAllByText("—")).toHaveLength(2);
  });

  it("invokes onSubdomainClick with the row uuid when a row is clicked", async () => {
    const onSubdomainClick = vi.fn();
    render(
      <UserSubdomainsTable
        subdomains={[baseSub]}
        onSubdomainClick={onSubdomainClick}
      />,
    );

    await userEvent.click(screen.getByText("castle"));
    expect(onSubdomainClick).toHaveBeenCalledWith("sub-1");
  });

  it("renders the empty message when there are no subdomains", () => {
    render(<UserSubdomainsTable subdomains={[]} onSubdomainClick={vi.fn()} />);

    expect(screen.getByText("admin.noSubdomains")).toBeInTheDocument();
  });
});
