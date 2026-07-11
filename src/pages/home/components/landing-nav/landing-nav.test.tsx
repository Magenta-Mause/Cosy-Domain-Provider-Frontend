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

vi.mock("@/components/layout/cosy-logo", () => ({
  CosyLogo: ({ testId }: { testId?: string }) => <div data-testid={testId} />,
}));

vi.mock("@/components/layout/language-menu", () => ({
  LanguageMenu: () => <div data-testid="language-menu" />,
}));

const useAuthInformation = vi.fn();
vi.mock("@/hooks/useAuthInformation/useAuthInformation", () => ({
  default: () => useAuthInformation(),
}));

import { LandingNav } from "./landing-nav";

describe("LandingNav", () => {
  it("renders logo, nav links and language menu", () => {
    useAuthInformation.mockReturnValue({ isUserLoggedIn: false });
    render(<LandingNav />);
    expect(screen.getByTestId("home-logo")).toBeInTheDocument();
    expect(screen.getByTestId("home-features-link")).toBeInTheDocument();
    expect(screen.getByTestId("home-pricing-link")).toBeInTheDocument();
    expect(screen.getByTestId("language-menu")).toBeInTheDocument();
  });

  it("shows login and signup links when logged out", () => {
    useAuthInformation.mockReturnValue({ isUserLoggedIn: false });
    render(<LandingNav />);
    expect(screen.getByTestId("home-login-link")).toBeInTheDocument();
    expect(screen.getByTestId("home-signup-link")).toBeInTheDocument();
    expect(screen.queryByTestId("home-dashboard-link")).not.toBeInTheDocument();
  });

  it("shows the dashboard link when logged in", () => {
    useAuthInformation.mockReturnValue({ isUserLoggedIn: true });
    render(<LandingNav />);
    const dashboard = screen.getByTestId("home-dashboard-link");
    expect(dashboard).toBeInTheDocument();
    expect(dashboard).toHaveAttribute("href", "/dashboard");
    expect(screen.queryByTestId("home-login-link")).not.toBeInTheDocument();
    expect(screen.queryByTestId("home-signup-link")).not.toBeInTheDocument();
  });

  it("points the anchor links at the features and pricing sections", () => {
    useAuthInformation.mockReturnValue({ isUserLoggedIn: false });
    render(<LandingNav />);
    expect(screen.getByTestId("home-features-link")).toHaveAttribute(
      "href",
      "#features",
    );
    expect(screen.getByTestId("home-pricing-link")).toHaveAttribute(
      "href",
      "#pricing",
    );
  });
});
