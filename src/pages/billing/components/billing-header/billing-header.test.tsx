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

vi.mock("@/components/layout/page-header", () => ({
  PageHeader: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="page-header">{children}</div>
  ),
}));

import { BillingHeader } from "./billing-header";

describe("BillingHeader", () => {
  it("renders the billing title inside a page header", () => {
    render(<BillingHeader />);

    expect(screen.getByTestId("page-header")).toBeInTheDocument();
    expect(screen.getByText("billing.title")).toBeInTheDocument();
  });

  it("renders a back link to the dashboard", () => {
    render(<BillingHeader />);

    const backLink = screen.getByTestId("billing-back-link");
    expect(backLink).toHaveAttribute("href", "/dashboard");
    expect(backLink).toHaveTextContent("dashboard.title");
  });
});
