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

vi.mock("@/components/pixel/badge", () => ({
  Badge: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

vi.mock("@/components/pixel/panel", () => ({
  Panel: ({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...rest}>{children}</div>
  ),
}));

import { PricingSection } from "./pricing-section";

describe("PricingSection", () => {
  it("renders the pricing heading and subtitle keys", () => {
    render(<PricingSection />);
    expect(screen.getByText("pricing.title")).toBeInTheDocument();
    expect(screen.getByText("pricing.subtitle")).toBeInTheDocument();
  });

  it("renders the free tier content", () => {
    render(<PricingSection />);
    expect(screen.getByText("pricing.freeTitle")).toBeInTheDocument();
    expect(screen.getByText("pricing.freePrice")).toBeInTheDocument();
    expect(screen.getByText("pricing.freeFeature1")).toBeInTheDocument();
    expect(screen.getByText("pricing.freeLimitation")).toBeInTheDocument();
  });

  it("renders the plus tier content", () => {
    render(<PricingSection />);
    expect(screen.getByText("pricing.plusTitle")).toBeInTheDocument();
    expect(screen.getByText("pricing.plusPrice")).toBeInTheDocument();
    expect(screen.getByText("pricing.plusFeature1")).toBeInTheDocument();
    expect(screen.getByText("pricing.plusFeature2")).toBeInTheDocument();
    expect(screen.getByText("pricing.plusSupport")).toBeInTheDocument();
  });

  it("links both CTA buttons to the register route", () => {
    render(<PricingSection />);
    expect(screen.getByTestId("home-register-free-link")).toHaveAttribute(
      "href",
      "/register",
    );
    expect(screen.getByTestId("home-register-plus-link")).toHaveAttribute(
      "href",
      "/register",
    );
  });
});
