import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, ...rest }: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a {...rest}>{children}</a>
  ),
}));

vi.mock("@/components/layout/page-header", () => ({
  PageHeader: ({
    children,
    headerRightSlot,
  }: {
    children?: React.ReactNode;
    headerRightSlot?: React.ReactNode;
  }) => (
    <div data-testid="page-header">
      {headerRightSlot}
      {children}
    </div>
  ),
}));

vi.mock("@/components/layout/cosy-logo", () => ({
  CosyLogo: () => <div data-testid="cosy-logo" />,
}));

const defaultLogic = {
  key: "",
  isAuthenticated: false,
  loginError: false,
  login: vi.fn(),
  logout: vi.fn(),
  inputKey: "",
  setInputKey: vi.fn(),
  isLogging: false,
  handleLogin: vi.fn((e: React.SyntheticEvent) => e.preventDefault()),
};

let mockLogic = { ...defaultLogic };

vi.mock("./useAdminLogic", () => ({
  useAdminLogic: () => mockLogic,
}));

import { AdminAuthGate } from "./index";

beforeEach(() => {
  vi.clearAllMocks();
  mockLogic = { ...defaultLogic };
});

describe("AdminAuthGate", () => {
  it("shows the login form when unauthenticated", () => {
    render(<AdminAuthGate activeTab="subdomains" outlet={<div />} />);
    expect(screen.getByLabelText("admin.adminKey")).toBeInTheDocument();
  });

  it("shows the key error on failed login", () => {
    mockLogic = { ...defaultLogic, loginError: true };
    render(<AdminAuthGate activeTab="subdomains" outlet={<div />} />);
    expect(screen.getByText(/admin.adminKeyError/)).toBeInTheDocument();
  });

  it("renders the portal with tabs and outlet when authenticated", () => {
    mockLogic = { ...defaultLogic, isAuthenticated: true, key: "k" };
    render(
      <AdminAuthGate activeTab="users" outlet={<div data-testid="outlet" />} />,
    );
    expect(screen.getByTestId("outlet")).toBeInTheDocument();
    expect(screen.getByText("admin.tabSubdomains")).toBeInTheDocument();
    expect(screen.getByText("admin.tabUsers")).toBeInTheDocument();
  });

  it("logs out via the exit button", async () => {
    mockLogic = { ...defaultLogic, isAuthenticated: true, key: "k" };
    render(<AdminAuthGate activeTab="subdomains" outlet={<div />} />);
    await userEvent.click(screen.getByText("admin.exitPortal"));
    expect(mockLogic.logout).toHaveBeenCalled();
  });
});
