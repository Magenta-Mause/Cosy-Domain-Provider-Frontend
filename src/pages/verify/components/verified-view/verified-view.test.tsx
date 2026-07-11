import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    children,
    ...props
  }: {
    to: string;
    children: React.ReactNode;
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

import { VerifiedView } from "./verified-view";

describe("VerifiedView", () => {
  it("renders the success message container with title and description", () => {
    render(<VerifiedView />);
    expect(screen.getByTestId("verify-success-message")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "verify.successTitle" }),
    ).toBeInTheDocument();
    expect(screen.getByText("verify.successDescription")).toBeInTheDocument();
  });

  it("renders a continue link to the mfa-setup page", () => {
    render(<VerifiedView />);
    const link = screen.getByRole("link", { name: "verify.successBtn" });
    expect(link).toHaveAttribute("href", "/mfa-setup");
  });
});
