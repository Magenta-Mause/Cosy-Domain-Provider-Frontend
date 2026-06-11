import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en" },
  }),
}));

const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, ...rest }: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a {...rest}>{children}</a>
  ),
  useNavigate: () => mockNavigate,
  Outlet: () => <div data-testid="outlet" />,
}));

const defaultHeaderLogic = {
  userName: "alice" as string | null,
  isUserLoggedIn: true,
  userTier: "FREE" as const,
  isLoggingOut: false,
  isDeleting: false,
  handleLogout: vi.fn().mockResolvedValue(undefined),
  handleDelete: vi.fn().mockResolvedValue(undefined),
  showDeleteModal: false,
  handleConfirmDelete: vi.fn(),
  handleCancelDelete: vi.fn(),
};

let mockHeaderLogic = { ...defaultHeaderLogic };

vi.mock("./useAppHeaderLogic", () => ({
  useAppHeaderLogic: () => mockHeaderLogic,
}));

vi.mock("@/hooks/useAuthInformation/useAuthInformation", () => ({
  default: () => ({ userTier: "PLUS" }),
}));

const userMenuState = { menuOpen: false };
vi.mock("./user-menu/useUserMenuLogic", () => ({
  useUserMenuLogic: () => ({
    menuOpen: userMenuState.menuOpen,
    setMenuOpen: vi.fn(),
    menuRef: { current: null },
    initial: "A",
  }),
}));

const languageMenuState = { menuOpen: false };
const mockHandleLanguageChange = vi.fn();
vi.mock("./language-menu/useLanguageMenuLogic", () => ({
  useLanguageMenuLogic: () => ({
    menuOpen: languageMenuState.menuOpen,
    setMenuOpen: vi.fn(),
    menuRef: { current: null },
    languageCode: "EN",
    handleLanguageChange: mockHandleLanguageChange,
  }),
}));

vi.mock("@/hooks/useLanguageChange/useLanguageChange", () => ({
  useLanguageChange: () => ({ handleLanguageChange: vi.fn() }),
}));

import { AppHeader } from "./app-header";
import { AppShell } from "./app-shell";

beforeEach(() => {
  vi.clearAllMocks();
  mockHeaderLogic = { ...defaultHeaderLogic };
  userMenuState.menuOpen = false;
  languageMenuState.menuOpen = false;
});

describe("AppHeader", () => {
  it("renders logo, tier badge, language menu and user menu when logged in", () => {
    render(<AppHeader />);
    expect(screen.getByTestId("header-logo-link")).toBeInTheDocument();
    expect(screen.getByTestId("language-menu-toggle-btn")).toBeInTheDocument();
    expect(screen.getByTestId("user-menu-toggle-btn")).toBeInTheDocument();
    expect(screen.getByText("alice")).toBeInTheDocument();
  });

  it("shows the login link when logged out", () => {
    mockHeaderLogic = {
      ...defaultHeaderLogic,
      isUserLoggedIn: false,
      userName: null,
    };
    render(<AppHeader />);
    expect(screen.getByTestId("header-login-link")).toBeInTheDocument();
    expect(
      screen.queryByTestId("user-menu-toggle-btn"),
    ).not.toBeInTheDocument();
  });

  it("opens the user dropdown and triggers logout", async () => {
    userMenuState.menuOpen = true;
    render(<AppHeader />);
    await userEvent.click(screen.getByTestId("user-menu-logout-btn"));
    expect(mockHeaderLogic.handleLogout).toHaveBeenCalled();
  });

  it("navigates to settings from the dropdown", async () => {
    userMenuState.menuOpen = true;
    render(<AppHeader />);
    await userEvent.click(screen.getByTestId("user-menu-change-username-btn"));
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/settings" });
  });

  it("starts account deletion from the dropdown", async () => {
    userMenuState.menuOpen = true;
    render(<AppHeader />);
    await userEvent.click(screen.getByTestId("user-menu-delete-user-btn"));
    expect(mockHeaderLogic.handleDelete).toHaveBeenCalled();
  });

  it("renders the delete confirmation modal and confirms", async () => {
    mockHeaderLogic = { ...defaultHeaderLogic, showDeleteModal: true };
    render(<AppHeader />);
    await userEvent.click(screen.getByText("nav.deleteUserConfirm"));
    expect(mockHeaderLogic.handleConfirmDelete).toHaveBeenCalled();
  });

  it("cancels the delete confirmation modal", async () => {
    mockHeaderLogic = { ...defaultHeaderLogic, showDeleteModal: true };
    render(<AppHeader />);
    await userEvent.click(screen.getByText("nav.deleteUserCancel"));
    expect(mockHeaderLogic.handleCancelDelete).toHaveBeenCalled();
  });

  it("opens the language dropdown and switches language", async () => {
    languageMenuState.menuOpen = true;
    render(<AppHeader />);
    await userEvent.click(screen.getByTestId("language-menu-en-btn"));
    expect(mockHandleLanguageChange).toHaveBeenCalledWith("en");
  });
});

describe("AppShell", () => {
  it("renders the outlet and footer", () => {
    render(<AppShell />);
    expect(screen.getByTestId("outlet")).toBeInTheDocument();
    expect(screen.getByTestId("footer-github-link")).toBeInTheDocument();
    expect(screen.getByTestId("footer-impressum-link")).toBeInTheDocument();
  });
});
