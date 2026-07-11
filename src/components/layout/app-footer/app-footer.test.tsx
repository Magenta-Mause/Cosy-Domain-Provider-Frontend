import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    children,
    ...rest
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}));

import { AppFooter } from "./app-footer";

describe("AppFooter", () => {
  it("renders the github link pointing at the org", () => {
    render(<AppFooter />);
    const github = screen.getByTestId("footer-github-link");
    expect(github).toHaveAttribute("href", "https://github.com/magenta-mause");
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders the three legal links to their routes", () => {
    render(<AppFooter />);
    expect(screen.getByTestId("footer-impressum-link")).toHaveAttribute(
      "href",
      "/legal-notice",
    );
    expect(screen.getByTestId("footer-datenschutz-link")).toHaveAttribute(
      "href",
      "/privacy",
    );
    expect(screen.getByTestId("footer-agb-link")).toHaveAttribute(
      "href",
      "/terms",
    );
  });

  it("exposes the contentinfo landmark and translated made-by text", () => {
    render(<AppFooter />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByText("footer.madeBy")).toBeInTheDocument();
  });
});
