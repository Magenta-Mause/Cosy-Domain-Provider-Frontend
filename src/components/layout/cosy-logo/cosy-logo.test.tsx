import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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

import { CosyLogo } from "./cosy-logo";

describe("CosyLogo", () => {
  it("renders as a plain div (no link) when linkTo is omitted", () => {
    render(<CosyLogo />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("COSY")).toBeInTheDocument();
    expect(screen.getByText("Domain Provider")).toBeInTheDocument();
    expect(screen.getByAltText("Cosy")).toBeInTheDocument();
  });

  it("renders a link with the given target and testId when linkTo is set", () => {
    render(<CosyLogo linkTo="/dashboard" testId="header-logo-link" />);
    const link = screen.getByTestId("header-logo-link");
    expect(link).toHaveAttribute("href", "/dashboard");
    expect(screen.getByText("COSY")).toBeInTheDocument();
  });
});
