import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, ...rest }: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a {...rest}>{children}</a>
  ),
}));

vi.mock("@/components/layout/page-header", () => ({
  PageHeader: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="page-header">{children}</div>
  ),
}));

vi.mock("@/hooks/useAuthInformation/useAuthInformation", () => ({
  default: () => ({ userName: "alice", updateUser: vi.fn() }),
}));

vi.mock("./components/useChangeUsernameFormLogic", () => ({
  useChangeUsernameFormLogic: () => ({
    newUsername: "alice",
    setNewUsername: vi.fn(),
    saving: false,
    success: false,
    error: null,
    canSubmit: false,
    handleSubmit: vi.fn(),
  }),
}));

vi.mock("./components/useChangePasswordFormLogic", () => ({
  useChangePasswordFormLogic: () => ({
    currentPassword: "",
    setCurrentPassword: vi.fn(),
    newPassword: "",
    setNewPassword: vi.fn(),
    confirmPassword: "",
    setConfirmPassword: vi.fn(),
    saving: false,
    success: false,
    error: null,
    newPasswordWeak: false,
    passwordsMatch: true,
    canSubmit: false,
    handleSubmit: vi.fn(),
  }),
}));

vi.mock("./components/useLinkedAccountsLogic", () => ({
  useLinkedAccountsLogic: () => ({
    allProviders: ["google", "github", "discord"],
    identities: [],
    loading: false,
    isLinked: () => false,
    handleLink: vi.fn(),
    handleUnlink: vi.fn(),
    unlinkingProvider: null,
    unlinkError: null,
    justLinked: false,
    justLinkFailed: false,
  }),
}));

import { SettingsPage } from "./index";

describe("SettingsPage", () => {
  it("renders all three settings sections", () => {
    render(<SettingsPage />);
    expect(screen.getByText("settings.usernameSection")).toBeInTheDocument();
    expect(screen.getByText("settings.passwordSection")).toBeInTheDocument();
    expect(
      screen.getByText("settings.linkedAccounts.section"),
    ).toBeInTheDocument();
  });
});
