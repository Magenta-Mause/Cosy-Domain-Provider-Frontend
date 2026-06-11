import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AdminSubdomain } from "@/api/admin-api";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { SubdomainsTable } from "./subdomains-table";

const subdomains: AdminSubdomain[] = [
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
  {
    uuid: "s2",
    label: "village",
    fqdn: null,
    targetIp: null,
    targetIpv6: "2001:db8::1",
    status: "PENDING",
    labelMode: "RANDOM",
    ownerUuid: "u2",
    ownerUsername: "bob",
    ownerEmail: "bob@example.com",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
];

const onSubdomainClick = vi.fn();

beforeEach(() => vi.clearAllMocks());

describe("SubdomainsTable", () => {
  it("renders one row per subdomain with status colors", () => {
    render(
      <SubdomainsTable
        subdomains={subdomains}
        onSubdomainClick={onSubdomainClick}
      />,
    );
    expect(screen.getByText("castle")).toBeInTheDocument();
    expect(screen.getByText("village")).toBeInTheDocument();
    expect(screen.getByText("ACTIVE")).toBeInTheDocument();
    expect(screen.getByText("PENDING")).toBeInTheDocument();
  });

  it("notifies on row click with the subdomain uuid", async () => {
    render(
      <SubdomainsTable
        subdomains={subdomains}
        onSubdomainClick={onSubdomainClick}
      />,
    );
    await userEvent.click(screen.getByText("castle"));
    expect(onSubdomainClick).toHaveBeenCalledWith("s1");
  });

  it("sorts by every sortable column without crashing", async () => {
    render(
      <SubdomainsTable
        subdomains={subdomains}
        onSubdomainClick={onSubdomainClick}
      />,
    );
    for (const header of [
      "admin.colLabel",
      "admin.colFqdn",
      "admin.colStatus",
      "admin.colMode",
      "admin.colTargetIpv4",
      "admin.colOwner",
      "admin.colCreated",
    ]) {
      await userEvent.click(screen.getByText(header));
      await userEvent.click(screen.getByText(header));
    }
    expect(screen.getByText("castle")).toBeInTheDocument();
  });
});
