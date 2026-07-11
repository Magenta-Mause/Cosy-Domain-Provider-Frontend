import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import type { DnsEntry } from "../../lib";
import { DnsEntriesPanel } from "./dns-entries-panel";

describe("DnsEntriesPanel", () => {
  it("renders the section heading and column headers", () => {
    render(<DnsEntriesPanel entries={[]} />);
    expect(screen.getByText("admin.dnsEntriesSection")).toBeInTheDocument();
    expect(screen.getByText("admin.colDnsName")).toBeInTheDocument();
    expect(screen.getByText("admin.colDnsType")).toBeInTheDocument();
    expect(screen.getByText("admin.colDnsValue")).toBeInTheDocument();
  });

  it("shows the empty state when there are no entries", () => {
    render(<DnsEntriesPanel entries={[]} />);
    expect(screen.getByText("admin.noDnsEntries")).toBeInTheDocument();
  });

  it("renders a row for each DNS entry", () => {
    const entries: DnsEntry[] = [
      { name: "castle.play.cosy-hosting.net", type: "A", value: "192.0.2.1" },
      { name: "castle.play.cosy-hosting.net", type: "AAAA", value: "::1" },
    ];
    render(<DnsEntriesPanel entries={entries} />);
    expect(screen.queryByText("admin.noDnsEntries")).not.toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("AAAA")).toBeInTheDocument();
    expect(screen.getByText("192.0.2.1")).toBeInTheDocument();
    expect(screen.getByText("::1")).toBeInTheDocument();
    expect(screen.getAllByText("castle.play.cosy-hosting.net")).toHaveLength(2);
  });
});
