import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { SubdomainDto } from "@/api/generated/model";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

import { SubdomainListItem } from "./subdomain-list-item";

const baseSub: SubdomainDto = {
  uuid: "s1",
  label: "castle",
  fqdn: "castle.play.cosy-hosting.net",
  targetIp: "192.0.2.1",
  status: "ACTIVE",
  labelMode: "CUSTOM",
  createdAt: "2026-01-01T00:00:00Z",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("SubdomainListItem", () => {
  it("renders the fqdn and target ip", () => {
    render(<SubdomainListItem domain={baseSub} />);

    expect(screen.getByTestId("dashboard-domain-item-s1")).toBeInTheDocument();
    expect(
      screen.getByText("castle.play.cosy-hosting.net"),
    ).toBeInTheDocument();
    expect(screen.getByText(/192.0.2.1/)).toBeInTheDocument();
  });

  it("falls back to the label when no fqdn is present", () => {
    render(<SubdomainListItem domain={{ ...baseSub, fqdn: undefined }} />);

    expect(screen.getByText("castle")).toBeInTheDocument();
  });

  it("shows the not-connected message when there is no target ip", () => {
    render(<SubdomainListItem domain={{ ...baseSub, targetIp: undefined }} />);

    expect(screen.getByText("dashboard.notConnected")).toBeInTheDocument();
  });

  it("navigates to the domain detail page on click", async () => {
    render(<SubdomainListItem domain={baseSub} />);

    await userEvent.click(screen.getByTestId("dashboard-domain-item-s1"));
    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/domain/$domainId",
      params: { domainId: "s1" },
    });
  });

  it("does not navigate when the domain has no uuid", async () => {
    render(<SubdomainListItem domain={{ ...baseSub, uuid: undefined }} />);

    await userEvent.click(
      screen.getByTestId("dashboard-domain-item-undefined"),
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
