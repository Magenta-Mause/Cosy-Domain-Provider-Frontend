import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import type { SubdomainDto } from "@/api/generated/model";

import { DomainMetaCards } from "./domain-meta-cards";

describe("DomainMetaCards", () => {
  it("renders the fqdn and created labels", () => {
    render(<DomainMetaCards domain={undefined} createdAt="Jan 1, 2026" />);
    expect(screen.getByText("domainDetail.domainFqdn")).toBeInTheDocument();
    expect(screen.getByText("domainDetail.createdLabel")).toBeInTheDocument();
  });

  it("shows the domain fqdn when present", () => {
    const domain = { fqdn: "my-castle.play.cosy-hosting.net" } as SubdomainDto;
    render(<DomainMetaCards domain={domain} createdAt="Jan 1, 2026" />);
    expect(
      screen.getByText("my-castle.play.cosy-hosting.net"),
    ).toBeInTheDocument();
  });

  it("falls back to a dash when there is no domain", () => {
    render(<DomainMetaCards domain={undefined} createdAt="Jan 1, 2026" />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("shows the formatted created-at value", () => {
    render(<DomainMetaCards domain={undefined} createdAt="Jan 1, 2026" />);
    expect(screen.getByText("Jan 1, 2026")).toBeInTheDocument();
  });
});
