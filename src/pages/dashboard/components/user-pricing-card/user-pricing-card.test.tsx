import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

const mockAuthInfo = vi.fn();
vi.mock("@/hooks/useAuthInformation/useAuthInformation", () => ({
  default: () => mockAuthInfo(),
}));

import UserPricingCard from "./user-pricing-card";

beforeEach(() => {
  vi.clearAllMocks();
  mockAuthInfo.mockReturnValue({ maxSubdomainCount: 3, userTier: "FREE" });
});

describe("UserPricingCard", () => {
  it("renders the subdomain count against the max", () => {
    render(<UserPricingCard serverCount={2} />);

    expect(screen.getByText(/2\/3/)).toBeInTheDocument();
    expect(
      screen.getByText(/dashboard.planCardSubdomains/),
    ).toBeInTheDocument();
  });

  it("shows an em-dash when the max is unknown", () => {
    mockAuthInfo.mockReturnValue({ maxSubdomainCount: null, userTier: "FREE" });
    render(<UserPricingCard serverCount={1} />);

    expect(screen.getByText(/1\/—/)).toBeInTheDocument();
  });

  it("shows the free price for FREE tier", () => {
    render(<UserPricingCard serverCount={0} />);

    expect(screen.getByText("dashboard.planCardPriceFree")).toBeInTheDocument();
  });

  it("shows the plus price for PLUS tier", () => {
    mockAuthInfo.mockReturnValue({ maxSubdomainCount: 10, userTier: "PLUS" });
    render(<UserPricingCard serverCount={0} />);

    expect(screen.getByText("dashboard.planCardPricePlus")).toBeInTheDocument();
  });

  it("links to the billing page", () => {
    render(<UserPricingCard serverCount={0} />);

    const link = screen.getByText("dashboard.planCardManage");
    expect(link).toHaveAttribute("href", "/billing");
  });
});
