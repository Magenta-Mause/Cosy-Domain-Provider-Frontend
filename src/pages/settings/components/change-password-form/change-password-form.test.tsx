import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const defaultLogic = {
  currentPassword: "",
  setCurrentPassword: vi.fn(),
  newPassword: "",
  setNewPassword: vi.fn(),
  confirmPassword: "",
  setConfirmPassword: vi.fn(),
  saving: false,
  success: false,
  error: null as string | null,
  newPasswordWeak: false,
  passwordsMatch: true,
  canSubmit: true,
  handleSubmit: vi.fn((e: React.SyntheticEvent) => e.preventDefault()),
};

let mockLogic = { ...defaultLogic };

vi.mock("./useChangePasswordFormLogic", () => ({
  useChangePasswordFormLogic: () => mockLogic,
}));

import { ChangePasswordForm } from "./change-password-form";

beforeEach(() => {
  vi.clearAllMocks();
  mockLogic = { ...defaultLogic };
});

describe("ChangePasswordForm", () => {
  it("renders all three password fields", () => {
    render(<ChangePasswordForm onSave={vi.fn()} />);
    expect(
      screen.getByTestId("settings-current-password-input"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("settings-new-password-input"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("settings-confirm-password-input"),
    ).toBeInTheDocument();
  });

  it("submits the form to the logic hook", () => {
    render(<ChangePasswordForm onSave={vi.fn()} />);
    const form = screen
      .getByTestId("settings-password-submit-btn")
      .closest("form");
    expect(form).not.toBeNull();
    fireEvent.submit(form as HTMLFormElement);
    expect(mockLogic.handleSubmit).toHaveBeenCalled();
  });

  it("shows the success banner", () => {
    mockLogic = { ...defaultLogic, success: true };
    render(<ChangePasswordForm onSave={vi.fn()} />);
    expect(screen.getByTestId("settings-password-success")).toBeInTheDocument();
  });

  it("shows weak and mismatch errors", () => {
    mockLogic = {
      ...defaultLogic,
      newPasswordWeak: true,
      passwordsMatch: false,
      confirmPassword: "x",
    };
    render(<ChangePasswordForm onSave={vi.fn()} />);
    expect(screen.getByText(/settings.passwordTooShort/)).toBeInTheDocument();
    expect(screen.getByText(/settings.passwordMismatch/)).toBeInTheDocument();
  });
});
