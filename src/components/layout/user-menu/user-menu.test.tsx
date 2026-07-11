import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const menuState = { menuOpen: false };
const mockSetMenuOpen = vi.fn();
vi.mock("./useUserMenuLogic", () => ({
  useUserMenuLogic: (userName?: string | null) => ({
    menuOpen: menuState.menuOpen,
    setMenuOpen: mockSetMenuOpen,
    menuRef: { current: null },
    initial: (userName ?? "?").charAt(0).toUpperCase() || "?",
  }),
}));

const dropdownProps = vi.fn();
vi.mock("./user-menu-dropdown", () => ({
  UserMenuDropdown: (props: Record<string, unknown>) => {
    dropdownProps(props);
    return <div data-testid="user-menu-dropdown" />;
  },
}));

import { UserMenu } from "./user-menu";

beforeEach(() => {
  vi.clearAllMocks();
  menuState.menuOpen = false;
});

describe("UserMenu", () => {
  it("shows the user name and initial on the toggle button", () => {
    render(
      <UserMenu
        userName="alice"
        isLoggingOut={false}
        onLogout={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    const toggle = screen.getByTestId("user-menu-toggle-btn");
    expect(toggle).toHaveTextContent("alice");
    expect(toggle).toHaveTextContent("A");
  });

  it("falls back to the userMenu label when no name is provided", () => {
    render(
      <UserMenu isLoggingOut={false} onLogout={vi.fn()} onDelete={vi.fn()} />,
    );
    expect(screen.getByTestId("user-menu-toggle-btn")).toHaveTextContent(
      "nav.userMenu",
    );
  });

  it("keeps the dropdown hidden when closed and toggles on click", async () => {
    render(
      <UserMenu
        userName="bob"
        isLoggingOut={false}
        onLogout={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.queryByTestId("user-menu-dropdown")).not.toBeInTheDocument();
    await userEvent.click(screen.getByTestId("user-menu-toggle-btn"));
    expect(mockSetMenuOpen).toHaveBeenCalled();
  });

  it("renders the dropdown and forwards props when open", () => {
    menuState.menuOpen = true;
    const onLogout = vi.fn();
    const onDelete = vi.fn();
    render(
      <UserMenu
        userName="bob"
        isLoggingOut
        restricted
        onLogout={onLogout}
        onDelete={onDelete}
      />,
    );
    expect(screen.getByTestId("user-menu-dropdown")).toBeInTheDocument();
    expect(dropdownProps).toHaveBeenCalledWith(
      expect.objectContaining({
        isLoggingOut: true,
        restricted: true,
        onLogout,
        onDelete,
      }),
    );
  });

  it("disables the toggle while logging out", () => {
    render(
      <UserMenu
        userName="bob"
        isLoggingOut
        onLogout={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByTestId("user-menu-toggle-btn")).toBeDisabled();
  });
});
