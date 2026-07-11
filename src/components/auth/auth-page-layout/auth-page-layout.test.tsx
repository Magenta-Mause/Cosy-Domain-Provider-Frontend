import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, ...rest }: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a {...rest}>{children}</a>
  ),
}));

vi.mock("@/components/layout/language-menu", () => ({
  LanguageMenu: () => <div data-testid="language-menu" />,
}));

vi.mock("@/components/layout/user-menu", () => ({
  UserMenu: () => <div data-testid="user-menu" />,
}));

const defaultLogic = {
  userName: null as string | null,
  isUserLoggedIn: false,
  isLoggingOut: false,
  handleLogout: vi.fn(),
  handleDelete: vi.fn(),
};

let mockLogic = { ...defaultLogic };

vi.mock("./useAuthPageLayoutLogic", () => ({
  useAuthPageLayoutLogic: () => mockLogic,
}));

import { AuthPageLayout } from "./auth-page-layout";

beforeEach(() => {
  vi.clearAllMocks();
  mockLogic = { ...defaultLogic };
});

describe("AuthPageLayout", () => {
  it("renders children with a back link by default", () => {
    render(
      <AuthPageLayout>
        <div data-testid="content" />
      </AuthPageLayout>,
    );
    expect(screen.getByTestId("content")).toBeInTheDocument();
    expect(screen.getByTestId("auth-back-link")).toBeInTheDocument();
    expect(screen.getByTestId("language-menu")).toBeInTheDocument();
  });

  it("hides the back link when set to null", () => {
    render(
      <AuthPageLayout backButtonLink={null}>
        <div />
      </AuthPageLayout>,
    );
    expect(screen.queryByTestId("auth-back-link")).not.toBeInTheDocument();
  });

  it("shows the user menu when logged in", () => {
    mockLogic = { ...defaultLogic, isUserLoggedIn: true, userName: "alice" };
    render(
      <AuthPageLayout>
        <div />
      </AuthPageLayout>,
    );
    expect(screen.getByTestId("user-menu")).toBeInTheDocument();
  });
});
