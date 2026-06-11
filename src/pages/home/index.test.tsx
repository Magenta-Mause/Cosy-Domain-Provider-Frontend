import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, ...rest }: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a {...rest}>{children}</a>
  ),
  useNavigate: () => vi.fn(),
}));

vi.mock("@/hooks/useAuthInformation/useAuthInformation", () => ({
  default: () => ({ isLoggedIn: false, userName: null }),
}));

vi.mock("@/components/layout/language-menu", () => ({
  LanguageMenu: () => <div data-testid="language-menu" />,
}));

import { HomePage } from "./index";

describe("HomePage", () => {
  it("renders nav, hero, features and pricing", () => {
    render(<HomePage />);
    expect(screen.getByTestId("language-menu")).toBeInTheDocument();
    expect(screen.getByTestId("home-subdomain-input")).toBeInTheDocument();
    expect(screen.getByTestId("home-check-btn")).toBeInTheDocument();
  });
});
