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

vi.mock("@/components/auth/mfa-code-form", () => ({
  MfaCodeForm: (props: { otpTestId?: string; onConfirm: () => void }) => (
    <div data-testid={props.otpTestId}>
      <button
        type="button"
        data-testid="mock-mfa-confirm"
        onClick={() => props.onConfirm()}
      >
        confirm
      </button>
    </div>
  ),
}));

const defaultLogic = {
  step: 1 as number,
  email: "a@a.com",
  setEmail: vi.fn(),
  password: "",
  setPassword: vi.fn(),
  emailError: null as string | null,
  errorMessage: null as string | null,
  oauthError: false,
  oauthEmailTaken: false,
  submitting: false,
  captchaReady: true,
  handleSubmit: vi.fn((e: React.SyntheticEvent) => e.preventDefault()),
  goBack: vi.fn(),
  turnstileRef: { current: null },
  setCaptchaToken: vi.fn(),
  totpCode: "",
  setTotpCode: vi.fn(),
  totpError: null as string | null,
  handleTotpSubmit: vi.fn(),
};

let mockLogic = { ...defaultLogic };

vi.mock("./useLoginFormLogic", () => ({
  useLoginFormLogic: () => mockLogic,
}));

import { LoginForm } from "./login-form";

beforeEach(() => {
  vi.clearAllMocks();
  mockLogic = { ...defaultLogic };
});

describe("LoginForm", () => {
  it("renders the email step with OAuth buttons", () => {
    render(<LoginForm />);
    expect(screen.getByTestId("oauth-buttons")).toBeInTheDocument();
    expect(screen.getByText("login.title")).toBeInTheDocument();
  });

  it("renders the password step with the password field", () => {
    mockLogic = { ...defaultLogic, step: 2 };
    render(<LoginForm />);
    expect(screen.getByTestId("login-password-input")).toBeInTheDocument();
    expect(screen.getByText("login.submitButton")).toBeInTheDocument();
  });

  it("renders the MFA step", () => {
    mockLogic = { ...defaultLogic, step: 3 };
    render(<LoginForm />);
    expect(screen.getByTestId("login-totp-input")).toBeInTheDocument();
  });

  it("shows the submitting label while logging in", () => {
    mockLogic = { ...defaultLogic, step: 2, submitting: true };
    render(<LoginForm />);
    expect(screen.getByText("login.submitting")).toBeInTheDocument();
  });

  it("shows the captcha-loading label until the captcha is ready", () => {
    mockLogic = { ...defaultLogic, step: 2, captchaReady: false };
    render(<LoginForm />);
    expect(screen.getByText("login.captchaLoading")).toBeInTheDocument();
  });

  it("shows the oauth-email-taken error", () => {
    mockLogic = { ...defaultLogic, oauthEmailTaken: true };
    render(<LoginForm />);
    expect(screen.getByText(/login.oauthEmailTaken/)).toBeInTheDocument();
  });

  it("shows the login error on the password step", () => {
    mockLogic = { ...defaultLogic, step: 2, errorMessage: "bad credentials" };
    render(<LoginForm />);
    expect(screen.getByText(/bad credentials/)).toBeInTheDocument();
  });

  it("forwards captcha results to the logic hook", async () => {
    mockLogic = { ...defaultLogic, step: 2 };
    render(<LoginForm />);
    await userEvent.click(screen.getByTestId("captcha-success"));
    expect(mockLogic.setCaptchaToken).toHaveBeenCalledWith("captcha-token");
    await userEvent.click(screen.getByTestId("captcha-expire"));
    expect(mockLogic.setCaptchaToken).toHaveBeenCalledWith(null);
    await userEvent.click(screen.getByTestId("captcha-error"));
    expect(mockLogic.setCaptchaToken).toHaveBeenCalledTimes(3);
  });

  it("confirms the TOTP code on the MFA step", async () => {
    mockLogic = { ...defaultLogic, step: 3 };
    render(<LoginForm />);
    await userEvent.click(screen.getByTestId("mock-mfa-confirm"));
    expect(mockLogic.handleTotpSubmit).toHaveBeenCalled();
  });
});
