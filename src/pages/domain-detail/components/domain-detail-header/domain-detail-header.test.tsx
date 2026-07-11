import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    ...rest
  }: React.HTMLAttributes<HTMLAnchorElement> & { to?: string }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/layout/page-header", () => ({
  PageHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="page-header">{children}</div>
  ),
}));

vi.mock("@/components/pixel/mailbox", () => ({
  Mailbox: () => <div data-testid="mailbox" />,
}));

vi.mock("@/components/pixel/status-dot", () => ({
  StatusDot: ({ status }: { status: string }) => (
    <div data-testid="status-dot" data-status={status} />
  ),
}));

vi.mock("@/components/pixel/subdomain-status-badge", () => ({
  SubdomainStatusBadge: ({
    status,
    variant,
  }: {
    status: string;
    variant?: string;
  }) => (
    <div
      data-testid="status-badge"
      data-status={status}
      data-variant={variant}
    />
  ),
}));

import type { SubdomainDto } from "@/api/generated/model";
import { DomainDetailHeader } from "./domain-detail-header";

const domain: SubdomainDto = {
  uuid: "s1",
  label: "castle",
  fqdn: "castle.play.cosy-hosting.net",
  targetIp: "192.0.2.1",
  status: "ACTIVE",
  labelMode: "CUSTOM",
  createdAt: "2026-01-01T00:00:00Z",
  dnsEntries: [],
};

describe("DomainDetailHeader", () => {
  it("renders the back link", () => {
    render(<DomainDetailHeader domain={domain} isCreateMode={false} />);
    const link = screen.getByTestId("domain-detail-back-link");
    expect(link).toHaveTextContent("domainDetail.backToDomains");
    expect(link).toHaveAttribute("href", "/dashboard");
  });

  it("shows the domain fqdn and status in edit mode", () => {
    render(<DomainDetailHeader domain={domain} isCreateMode={false} />);
    expect(
      screen.getByText("castle.play.cosy-hosting.net"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("status-dot")).toHaveAttribute(
      "data-status",
      "ACTIVE",
    );
    expect(screen.getByTestId("status-badge")).toHaveAttribute(
      "data-variant",
      "detail",
    );
  });

  it("shows the create title and hides status in create mode", () => {
    render(<DomainDetailHeader domain={undefined} isCreateMode={true} />);
    expect(screen.getByText("domainDetail.createTitle")).toBeInTheDocument();
    expect(screen.queryByTestId("status-dot")).not.toBeInTheDocument();
    expect(screen.queryByTestId("status-badge")).not.toBeInTheDocument();
  });

  it("falls back to the label when no fqdn is present", () => {
    render(
      <DomainDetailHeader
        domain={{ ...domain, fqdn: undefined }}
        isCreateMode={false}
      />,
    );
    expect(screen.getByText("castle")).toBeInTheDocument();
  });

  it("does not render status when the domain has no status", () => {
    render(
      <DomainDetailHeader
        domain={{ ...domain, status: undefined }}
        isCreateMode={false}
      />,
    );
    expect(screen.queryByTestId("status-dot")).not.toBeInTheDocument();
  });
});
