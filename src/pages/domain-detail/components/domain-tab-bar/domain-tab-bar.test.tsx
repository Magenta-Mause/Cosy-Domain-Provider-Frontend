import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DomainTabBar } from "./domain-tab-bar";

describe("DomainTabBar", () => {
  it("renders a button for every tab with uppercase labels", () => {
    render(<DomainTabBar activeTab="overview" onChange={vi.fn()} />);
    expect(
      screen.getByTestId("domain-detail-tab-overview-btn"),
    ).toHaveTextContent("OVERVIEW");
    expect(screen.getByTestId("domain-detail-tab-dns-btn")).toHaveTextContent(
      "DNS RECORDS",
    );
    expect(
      screen.getByTestId("domain-detail-tab-danger-btn"),
    ).toHaveTextContent("DANGER ZONE");
  });

  it("styles the active tab differently from inactive tabs", () => {
    render(<DomainTabBar activeTab="dns" onChange={vi.fn()} />);
    const active = screen.getByTestId("domain-detail-tab-dns-btn");
    const inactive = screen.getByTestId("domain-detail-tab-overview-btn");
    expect(active).toHaveStyle({ background: "var(--secondary-background)" });
    expect(inactive).toHaveStyle({ background: "transparent" });
  });

  it("calls onChange with the tab key when a tab is clicked", async () => {
    const onChange = vi.fn();
    render(<DomainTabBar activeTab="overview" onChange={onChange} />);
    await userEvent.click(screen.getByTestId("domain-detail-tab-danger-btn"));
    expect(onChange).toHaveBeenCalledWith("danger");
  });
});
