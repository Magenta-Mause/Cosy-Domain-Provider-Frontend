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

vi.mock("@/components/layout/page-header", () => ({
  PageHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

import { SettingsHeader } from "./settings-header";

describe("SettingsHeader", () => {
  it("renders the settings title heading", () => {
    render(<SettingsHeader />);
    expect(
      screen.getByRole("heading", { name: "settings.title" }),
    ).toBeInTheDocument();
  });

  it("renders a back link to the dashboard", () => {
    render(<SettingsHeader />);
    const link = screen.getByTestId("settings-back-link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/dashboard");
    expect(link).toHaveTextContent("dashboard.title");
  });
});
