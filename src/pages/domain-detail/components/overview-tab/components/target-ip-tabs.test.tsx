import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { TargetIpTabs } from "./target-ip-tabs";

const baseProps = {
  targetIp: "",
  onTargetIpChange: vi.fn(),
  targetIpv6: "",
  onTargetIpv6Change: vi.fn(),
  activeTab: "ipv4" as const,
  onTabChange: vi.fn(),
  hasSubmitted: false,
  ipv4Valid: true,
  ipv6Valid: true,
  atLeastOneIp: true,
};

beforeEach(() => vi.clearAllMocks());

describe("TargetIpTabs", () => {
  it("shows the IPv4 field on the ipv4 tab", () => {
    render(<TargetIpTabs {...baseProps} />);
    expect(
      screen.getByTestId("domain-detail-target-ip-input"),
    ).toBeInTheDocument();
  });

  it("shows the IPv6 field on the ipv6 tab", () => {
    render(<TargetIpTabs {...baseProps} activeTab="ipv6" />);
    expect(
      screen.getByTestId("domain-detail-target-ipv6-input"),
    ).toBeInTheDocument();
  });

  it("switches tabs", async () => {
    render(<TargetIpTabs {...baseProps} />);
    await userEvent.click(screen.getByText("createSubdomain.ipTabIpv6"));
    expect(baseProps.onTabChange).toHaveBeenCalledWith("ipv6");
    await userEvent.click(screen.getByText("createSubdomain.ipTabIpv4"));
    expect(baseProps.onTabChange).toHaveBeenCalledWith("ipv4");
  });

  it("trims input values", async () => {
    render(<TargetIpTabs {...baseProps} />);
    await userEvent.type(
      screen.getByTestId("domain-detail-target-ip-input"),
      " ",
    );
    expect(baseProps.onTargetIpChange).toHaveBeenCalledWith("");
  });

  it("shows validation errors after submit", () => {
    render(
      <TargetIpTabs
        {...baseProps}
        hasSubmitted
        targetIp="not-an-ip"
        ipv4Valid={false}
        atLeastOneIp={false}
      />,
    );
    expect(screen.getByText(/domainDetail.ipv4Invalid/)).toBeInTheDocument();
    expect(
      screen.getByText(/domainDetail.atLeastOneIpRequired/),
    ).toBeInTheDocument();
  });

  it("shows the ipv6 error after submit", () => {
    render(
      <TargetIpTabs
        {...baseProps}
        activeTab="ipv6"
        hasSubmitted
        targetIpv6="nope"
        ipv6Valid={false}
      />,
    );
    expect(screen.getByText(/domainDetail.ipv6Invalid/)).toBeInTheDocument();
  });
});
