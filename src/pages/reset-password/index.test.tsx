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

vi.mock("@/components/auth/auth-page-layout", () => ({
  AuthPageLayout: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const defaultLogic = {
  token: "tok-1",
  newPassword: "",
  setNewPassword: vi.fn(),
  isSubmitting: false,
  success: false,
  error: null as string | null,
  handleSubmit: vi.fn((e: React.SyntheticEvent) => e.preventDefault()),
};

let mockLogic = { ...defaultLogic };

vi.mock("./useResetPasswordLogic", () => ({
  useResetPasswordLogic: () => mockLogic,
}));

import { ResetPasswordPage } from "./index";

beforeEach(() => {
  vi.clearAllMocks();
  mockLogic = { ...defaultLogic };
});

describe("ResetPasswordPage", () => {
  it("renders the new-password form when a token is present", () => {
    render(<ResetPasswordPage />);
    expect(screen.getByTestId("reset-password-input")).toBeInTheDocument();
  });

  it("renders an invalid-link view without a token", () => {
    mockLogic = { ...defaultLogic, token: "" };
    render(<ResetPasswordPage />);
    expect(
      screen.queryByTestId("reset-password-input"),
    ).not.toBeInTheDocument();
  });

  it("renders the success view", () => {
    mockLogic = { ...defaultLogic, success: true };
    render(<ResetPasswordPage />);
    expect(screen.getByText("resetPassword.success")).toBeInTheDocument();
  });
});
