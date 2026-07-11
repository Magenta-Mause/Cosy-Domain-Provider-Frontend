import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockNavigate = vi.fn();
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
  useNavigate: () => mockNavigate,
}));

import { UserMenuDropdown } from "./user-menu-dropdown";

function setup(
  overrides: Partial<Parameters<typeof UserMenuDropdown>[0]> = {},
) {
  const props = {
    isLoggingOut: false,
    onClose: vi.fn(),
    onLogout: vi.fn().mockResolvedValue(undefined),
    onDelete: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
  render(<UserMenuDropdown {...props} />);
  return props;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("UserMenuDropdown", () => {
  it("renders the menu with all four entries", () => {
    setup();
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(
      screen.getByTestId("user-menu-change-username-btn"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("user-menu-billing-btn")).toHaveAttribute(
      "href",
      "/billing",
    );
    expect(screen.getByTestId("user-menu-logout-btn")).toBeInTheDocument();
    expect(screen.getByTestId("user-menu-delete-user-btn")).toBeInTheDocument();
  });

  it("navigates to settings and closes when clicking user settings", async () => {
    const props = setup();
    await userEvent.click(screen.getByTestId("user-menu-change-username-btn"));
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/settings" });
    expect(props.onClose).toHaveBeenCalled();
  });

  it("logs out then closes", async () => {
    const props = setup();
    await userEvent.click(screen.getByTestId("user-menu-logout-btn"));
    expect(props.onLogout).toHaveBeenCalled();
    expect(props.onClose).toHaveBeenCalled();
  });

  it("triggers delete", async () => {
    const props = setup();
    await userEvent.click(screen.getByTestId("user-menu-delete-user-btn"));
    expect(props.onDelete).toHaveBeenCalled();
  });

  it("disables logout while logging out", () => {
    setup({ isLoggingOut: true });
    expect(screen.getByTestId("user-menu-logout-btn")).toBeDisabled();
  });

  it("disables settings and neutralises billing when restricted", () => {
    setup({ restricted: true });
    expect(screen.getByTestId("user-menu-change-username-btn")).toBeDisabled();
    const billing = screen.getByTestId("user-menu-billing-btn");
    expect(billing).toHaveAttribute("aria-disabled", "true");
    expect(billing.className).toContain("pointer-events-none");
  });
});
