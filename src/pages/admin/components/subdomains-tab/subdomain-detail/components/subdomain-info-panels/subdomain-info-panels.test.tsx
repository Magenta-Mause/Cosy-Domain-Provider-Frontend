import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import type { AdminSubdomain } from "@/api/admin-api";
import { SubdomainInfoPanels } from "./subdomain-info-panels";

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
  updatedAt: "2026-01-02T00:00:00Z",
};

describe("SubdomainInfoPanels", () => {
  it("renders the subdomain and owner details", () => {
    render(<SubdomainInfoPanels subdomain={baseSub} onOwnerClick={vi.fn()} />);
    expect(screen.getByText("s1")).toBeInTheDocument();
    expect(screen.getByText("castle")).toBeInTheDocument();
    expect(
      screen.getByText("castle.play.cosy-hosting.net"),
    ).toBeInTheDocument();
    expect(screen.getByText("CUSTOM")).toBeInTheDocument();
    expect(screen.getByText("192.0.2.1")).toBeInTheDocument();
    expect(screen.getByText("alice")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
  });

  it("renders the status via the StatusBadge", () => {
    render(<SubdomainInfoPanels subdomain={baseSub} onOwnerClick={vi.fn()} />);
    const badge = screen.getByText("ACTIVE");
    expect(badge).toHaveClass("text-green-600");
  });

  it("shows an em dash for a missing IPv6 target", () => {
    render(<SubdomainInfoPanels subdomain={baseSub} onOwnerClick={vi.fn()} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("calls onOwnerClick when the owner UUID button is clicked", async () => {
    const onOwnerClick = vi.fn();
    render(
      <SubdomainInfoPanels subdomain={baseSub} onOwnerClick={onOwnerClick} />,
    );
    await userEvent.click(screen.getByRole("button", { name: "u1" }));
    expect(onOwnerClick).toHaveBeenCalledTimes(1);
  });
});
