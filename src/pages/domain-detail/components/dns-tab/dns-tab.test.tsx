import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import type { SubdomainDto } from "@/api/generated/model";
import { DnsTab } from "./dns-tab";

const domainWithEntries: SubdomainDto = {
  uuid: "s1",
  label: "castle",
  fqdn: "castle.play.cosy-hosting.net",
  targetIp: "192.0.2.1",
  status: "ACTIVE",
  labelMode: "CUSTOM",
  createdAt: "2026-01-01T00:00:00Z",
  dnsEntries: [
    {
      name: "castle.play.cosy-hosting.net",
      type: "A",
      ttl: 300,
      values: ["192.0.2.1"],
    },
    {
      name: "castle.play.cosy-hosting.net",
      type: "AAAA",
      ttl: 600,
      values: ["2001:db8::1", "2001:db8::2"],
    },
  ],
};

describe("DnsTab", () => {
  it("renders the heading and the managed fqdn", () => {
    render(<DnsTab domain={domainWithEntries} />);
    expect(screen.getByText("domainDetail.dnsRecords")).toBeInTheDocument();
    expect(screen.getByText(/domainDetail.dnsManagedFor/)).toBeInTheDocument();
    expect(
      screen.getAllByText("castle.play.cosy-hosting.net").length,
    ).toBeGreaterThan(0);
  });

  it("renders the table headers and a row per DNS entry", () => {
    render(<DnsTab domain={domainWithEntries} />);
    for (const header of ["Type", "Name", "Value", "TTL"]) {
      expect(screen.getByText(header)).toBeInTheDocument();
    }
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("AAAA")).toBeInTheDocument();
    expect(screen.getByText("300")).toBeInTheDocument();
    expect(screen.getByText("600")).toBeInTheDocument();
    expect(screen.getByText("192.0.2.1")).toBeInTheDocument();
    expect(screen.getByText("2001:db8::1, 2001:db8::2")).toBeInTheDocument();
  });

  it("shows the empty state when there are no DNS entries", () => {
    render(<DnsTab domain={{ ...domainWithEntries, dnsEntries: [] }} />);
    expect(screen.getByText("domainDetail.dnsNoRecords")).toBeInTheDocument();
    expect(screen.queryByText("Type")).not.toBeInTheDocument();
  });

  it("falls back to the label when no fqdn is present", () => {
    render(
      <DnsTab
        domain={{ ...domainWithEntries, fqdn: undefined, dnsEntries: [] }}
      />,
    );
    expect(screen.getByText("castle")).toBeInTheDocument();
  });

  it("renders the empty state when domain is undefined", () => {
    render(<DnsTab domain={undefined} />);
    expect(screen.getByText("domainDetail.dnsNoRecords")).toBeInTheDocument();
  });

  it("renders placeholder dashes for missing cell values", () => {
    render(
      <DnsTab
        domain={{
          ...domainWithEntries,
          dnsEntries: [{ type: "TXT" }],
        }}
      />,
    );
    expect(screen.getByText("TXT")).toBeInTheDocument();
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
  });
});
