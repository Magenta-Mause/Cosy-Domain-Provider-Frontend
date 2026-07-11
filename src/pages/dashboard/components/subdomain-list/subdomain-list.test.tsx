import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { SubdomainDto } from "@/api/generated/model";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("./components/subdomain-list-item", () => ({
  SubdomainListItem: ({ domain }: { domain: SubdomainDto }) => (
    <div data-testid={`item-${domain.uuid}`}>{domain.fqdn}</div>
  ),
}));

import { SubdomainList } from "./subdomain-list";

const baseSub: SubdomainDto = {
  uuid: "s1",
  label: "castle",
  fqdn: "castle.play.cosy-hosting.net",
  targetIp: "192.0.2.1",
  status: "ACTIVE",
  labelMode: "CUSTOM",
  createdAt: "2026-01-01T00:00:00Z",
};

const baseProps = {
  subdomains: [baseSub],
  isLoading: false,
  isError: false,
  isVerified: true,
  isMfaEnabled: true,
};

describe("SubdomainList", () => {
  it("renders a list item for each subdomain", () => {
    render(<SubdomainList {...baseProps} />);

    expect(screen.getByTestId("item-s1")).toBeInTheDocument();
    expect(
      screen.getByText("castle.play.cosy-hosting.net"),
    ).toBeInTheDocument();
  });

  it("renders the error state", () => {
    render(<SubdomainList {...baseProps} isError={true} />);

    expect(screen.getByText(/dashboard.loadError/)).toBeInTheDocument();
    expect(screen.queryByTestId("item-s1")).not.toBeInTheDocument();
  });

  it("does not render list items while loading", () => {
    render(<SubdomainList {...baseProps} subdomains={[]} isLoading={true} />);

    expect(screen.queryByTestId("item-s1")).not.toBeInTheDocument();
  });

  it("shows the verified-with-mfa empty message", () => {
    render(<SubdomainList {...baseProps} subdomains={[]} />);

    expect(screen.getByText("dashboard.empty")).toBeInTheDocument();
  });

  it("shows the MFA-required empty message", () => {
    render(
      <SubdomainList {...baseProps} subdomains={[]} isMfaEnabled={false} />,
    );

    expect(screen.getByText("dashboard.emptyMfaRequired")).toBeInTheDocument();
  });

  it("shows the unverified empty message", () => {
    render(
      <SubdomainList
        {...baseProps}
        subdomains={[]}
        isVerified={false}
        isMfaEnabled={false}
      />,
    );

    expect(screen.getByText("dashboard.emptyUnverified")).toBeInTheDocument();
  });
});
