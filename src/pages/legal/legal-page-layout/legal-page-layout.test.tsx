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

vi.mock("@/components/layout/language-menu", () => ({
  LanguageMenu: () => <div data-testid="language-menu" />,
}));

vi.mock("@/components/pixel/panel", () => ({
  FlatPanel: ({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...rest}>{children}</div>
  ),
}));

import { LegalPageLayout } from "./legal-page-layout";

describe("LegalPageLayout", () => {
  it("renders the provided title as a heading", () => {
    render(
      <LegalPageLayout title="Privacy Policy">
        <p>body</p>
      </LegalPageLayout>,
    );
    expect(
      screen.getByRole("heading", { name: "Privacy Policy" }),
    ).toBeInTheDocument();
  });

  it("renders its children", () => {
    render(
      <LegalPageLayout title="Terms">
        <p data-testid="legal-body">some legal content</p>
      </LegalPageLayout>,
    );
    expect(screen.getByTestId("legal-body")).toHaveTextContent(
      "some legal content",
    );
  });

  it("renders a back link to the home route", () => {
    render(
      <LegalPageLayout title="Terms">
        <p>body</p>
      </LegalPageLayout>,
    );
    const back = screen.getByTestId("legal-back-link");
    expect(back).toHaveAttribute("href", "/");
    expect(back).toHaveTextContent("legal.back");
  });

  it("renders the language menu", () => {
    render(
      <LegalPageLayout title="Terms">
        <p>body</p>
      </LegalPageLayout>,
    );
    expect(screen.getByTestId("language-menu")).toBeInTheDocument();
  });
});
