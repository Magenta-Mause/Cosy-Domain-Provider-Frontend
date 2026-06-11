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

interface TurnstileProps {
  onSuccess?: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
}

vi.mock("@marsidev/react-turnstile", () => ({
  Turnstile: (props: TurnstileProps) => (
    <div data-testid="turnstile">
      <button
        type="button"
        data-testid="captcha-success"
        onClick={() => props.onSuccess?.("captcha-token")}
      >
        ok
      </button>
      <button
        type="button"
        data-testid="captcha-expire"
        onClick={() => props.onExpire?.()}
      >
        expire
      </button>
      <button
        type="button"
        data-testid="captcha-error"
        onClick={() => props.onError?.()}
      >
        err
      </button>
    </div>
  ),
}));

vi.mock("@/components/auth/oauth-buttons", () => ({
  OAuthButtons: () => <div data-testid="oauth-buttons" />,
}));

const defaultLogic = {
  step: 1 as number,
  username: "",
  setUsername: vi.fn(),
  email: "a@a.com",
  setEmail: vi.fn(),
  password: "",
  setPassword: vi.fn(),
  confirmPassword: "",
  setConfirmPassword: vi.fn(),
  agreed: false,
  setAgreed: vi.fn(),
  errorMessage: null as string | null,
  passwordWeak: false,
  confirmValid: true,
  canSubmit: true,
  captchaReady: true,
  submitting: false,
  handleSubmit: vi.fn((e: React.SyntheticEvent) => e.preventDefault()),
  goBack: vi.fn(),
  turnstileRef: { current: null },
  setCaptchaToken: vi.fn(),
};

let mockLogic = { ...defaultLogic };

vi.mock("./useRegisterFormLogic", () => ({
  useRegisterFormLogic: () => mockLogic,
}));

import { RegisterForm } from "./register-form";

beforeEach(() => {
  vi.clearAllMocks();
  mockLogic = { ...defaultLogic };
});

describe("RegisterForm", () => {
  it("renders the email step with OAuth buttons", () => {
    render(<RegisterForm />);
    expect(screen.getByTestId("oauth-buttons")).toBeInTheDocument();
  });

  it("renders the details step with password fields and terms checkbox", () => {
    mockLogic = { ...defaultLogic, step: 2 };
    render(<RegisterForm />);
    expect(screen.getByTestId("register-password-input")).toBeInTheDocument();
    expect(
      screen.getByTestId("register-confirm-password-input"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("register-terms-checkbox")).toBeInTheDocument();
  });

  it("shows the weak-password error", () => {
    mockLogic = { ...defaultLogic, step: 2, passwordWeak: true };
    render(<RegisterForm />);
    expect(screen.getByText(/register.passwordTooShort/)).toBeInTheDocument();
  });

  it("shows the mismatch error on the confirm field", () => {
    mockLogic = {
      ...defaultLogic,
      step: 2,
      confirmPassword: "abc",
      confirmValid: false,
    };
    render(<RegisterForm />);
    expect(screen.getByText(/register.passwordMismatch/)).toBeInTheDocument();
  });

  it("shows the error message when registration fails", () => {
    mockLogic = { ...defaultLogic, step: 2, errorMessage: "taken" };
    render(<RegisterForm />);
    expect(screen.getByText(/taken/)).toBeInTheDocument();
  });

  it("toggles the terms agreement", async () => {
    mockLogic = { ...defaultLogic, step: 2 };
    render(<RegisterForm />);
    await userEvent.click(screen.getByTestId("register-terms-checkbox"));
    expect(mockLogic.setAgreed).toHaveBeenCalledWith(true);
  });

  it("forwards captcha results to the logic hook", async () => {
    mockLogic = { ...defaultLogic, step: 2 };
    render(<RegisterForm />);
    await userEvent.click(screen.getByTestId("captcha-success"));
    expect(mockLogic.setCaptchaToken).toHaveBeenCalledWith("captcha-token");
    await userEvent.click(screen.getByTestId("captcha-expire"));
    expect(mockLogic.setCaptchaToken).toHaveBeenCalledWith(null);
    await userEvent.click(screen.getByTestId("captcha-error"));
    expect(mockLogic.setCaptchaToken).toHaveBeenCalledTimes(3);
  });

  it("renders clickable terms and privacy links", async () => {
    mockLogic = { ...defaultLogic, step: 2 };
    render(<RegisterForm />);
    const terms = screen.getByText("register.termsLink");
    const privacy = screen.getByText("register.privacyPolicyLink");
    await userEvent.click(terms);
    await userEvent.click(privacy);
    expect(terms).toBeInTheDocument();
    expect(privacy).toBeInTheDocument();
  });
});
