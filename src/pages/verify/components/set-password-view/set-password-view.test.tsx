import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { SetPasswordView } from "./set-password-view";

const baseProps = {
  password: "",
  confirmPassword: "",
  passwordError: null as string | null,
  isSettingPassword: false,
  onPasswordChange: vi.fn(),
  onConfirmChange: vi.fn(),
  onSubmit: vi.fn((e: React.SyntheticEvent) => e.preventDefault()),
};

describe("SetPasswordView", () => {
  it("renders the title and both password fields", () => {
    render(<SetPasswordView {...baseProps} />);
    expect(screen.getByText("passwordSetup.title")).toBeInTheDocument();
    expect(screen.getByLabelText("passwordSetup.password")).toBeInTheDocument();
    expect(screen.getByLabelText("passwordSetup.confirm")).toBeInTheDocument();
  });

  const submitBtn = () =>
    screen.getByRole("button", { name: /passwordSetup.submit/ });

  it("disables submit when fields are empty", () => {
    render(<SetPasswordView {...baseProps} />);
    expect(submitBtn()).toBeDisabled();
  });

  it("shows the weak password error for short passwords", () => {
    render(<SetPasswordView {...baseProps} password="abc" />);
    expect(screen.getByText(/register.passwordTooShort/)).toBeInTheDocument();
    expect(submitBtn()).toBeDisabled();
  });

  it("shows the mismatch error when confirmation differs", () => {
    render(
      <SetPasswordView
        {...baseProps}
        password="strongpass1"
        confirmPassword="different"
      />,
    );
    expect(screen.getByText(/passwordSetup.mismatch/)).toBeInTheDocument();
    expect(submitBtn()).toBeDisabled();
  });

  it("enables submit and calls onSubmit with valid matching passwords", () => {
    const onSubmit = vi.fn((e: React.SyntheticEvent) => e.preventDefault());
    render(
      <SetPasswordView
        {...baseProps}
        password="strongpass1"
        confirmPassword="strongpass1"
        onSubmit={onSubmit}
      />,
    );
    const btn = screen.getByRole("button", {
      name: "passwordSetup.submitContinue",
    });
    expect(btn).not.toBeDisabled();
    fireEvent.submit(btn.closest("form") as HTMLFormElement);
    expect(onSubmit).toHaveBeenCalled();
  });

  it("shows the submitting label and disables submit while setting", () => {
    render(
      <SetPasswordView
        {...baseProps}
        password="strongpass1"
        confirmPassword="strongpass1"
        isSettingPassword={true}
      />,
    );
    const btn = screen.getByRole("button", {
      name: "passwordSetup.submitting",
    });
    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent("passwordSetup.submitting");
  });

  it("renders a passwordError when present", () => {
    render(<SetPasswordView {...baseProps} passwordError="server exploded" />);
    expect(screen.getByText(/server exploded/)).toBeInTheDocument();
  });
});
