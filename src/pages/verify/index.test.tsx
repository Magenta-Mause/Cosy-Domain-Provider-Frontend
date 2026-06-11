import { fireEvent, render, screen } from "@testing-library/react";
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

vi.mock("@/components/auth/auth-page-layout", () => ({
  AuthPageLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-layout">{children}</div>
  ),
}));

interface VerifyFormProps {
  onTokenChange: (code: string) => void;
  onVerify: () => void;
  onResend: () => void;
}

vi.mock("./components/verify-form", () => ({
  VerifyForm: (props: VerifyFormProps) => (
    <div data-testid="verify-form">
      <button
        type="button"
        data-testid="mock-token-change"
        onClick={() => props.onTokenChange("abc 123")}
      >
        change
      </button>
      <button
        type="button"
        data-testid="mock-verify"
        onClick={() => props.onVerify()}
      >
        verify
      </button>
      <button
        type="button"
        data-testid="mock-resend"
        onClick={() => props.onResend()}
      >
        resend
      </button>
    </div>
  ),
}));

const defaultLogic = {
  userEmail: "a@a.com",
  stage: "verify" as string,
  verificationToken: "",
  setVerificationToken: vi.fn(),
  isVerifying: false,
  isSending: false,
  resendSent: false,
  verifyError: null as string | null,
  setVerifyError: vi.fn(),
  sendError: null as string | null,
  resendError: null as string | null,
  isBusy: false,
  triggerVerification: vi.fn(),
  triggerSendEmail: vi.fn(),
  triggerResend: vi.fn(),
  password: "",
  setPassword: vi.fn(),
  confirmPassword: "",
  setConfirmPassword: vi.fn(),
  passwordError: null as string | null,
  isSettingPassword: false,
  triggerPasswordSetup: vi.fn(),
};

let mockLogic = { ...defaultLogic };

vi.mock("./useVerifyLogic", () => ({
  useVerifyLogic: () => mockLogic,
}));

import { VerifyPage } from "./index";

beforeEach(() => {
  vi.clearAllMocks();
  mockLogic = { ...defaultLogic };
});

describe("VerifyPage", () => {
  it("renders the verify form by default", () => {
    render(<VerifyPage />);
    expect(screen.getByTestId("verify-form")).toBeInTheDocument();
  });

  it("renders the password setup stage", () => {
    mockLogic = { ...defaultLogic, stage: "password" };
    render(<VerifyPage />);
    expect(screen.getByText("passwordSetup.title")).toBeInTheDocument();
  });

  it("renders the send email stage", () => {
    mockLogic = { ...defaultLogic, stage: "send" };
    render(<VerifyPage />);
    expect(screen.queryByTestId("verify-form")).not.toBeInTheDocument();
  });

  it("renders the success stage", () => {
    mockLogic = { ...defaultLogic, stage: "success" };
    render(<VerifyPage />);
    expect(screen.queryByTestId("verify-form")).not.toBeInTheDocument();
  });

  it("sanitizes the code and auto-verifies at 6 characters", async () => {
    render(<VerifyPage />);
    await userEvent.click(screen.getByTestId("mock-token-change"));
    expect(mockLogic.setVerificationToken).toHaveBeenCalledWith("abc123");
    expect(mockLogic.setVerifyError).toHaveBeenCalledWith(null);
    expect(mockLogic.triggerVerification).toHaveBeenCalledWith("abc123");
  });

  it("verifies and resends via the form callbacks", async () => {
    render(<VerifyPage />);
    await userEvent.click(screen.getByTestId("mock-verify"));
    expect(mockLogic.triggerVerification).toHaveBeenCalledWith("");
    await userEvent.click(screen.getByTestId("mock-resend"));
    expect(mockLogic.triggerResend).toHaveBeenCalled();
  });

  it("sends the email from the send stage", async () => {
    mockLogic = { ...defaultLogic, stage: "send" };
    render(<VerifyPage />);
    await userEvent.click(screen.getByRole("button"));
    expect(mockLogic.triggerSendEmail).toHaveBeenCalled();
  });

  it("submits the password setup form", () => {
    mockLogic = { ...defaultLogic, stage: "password" };
    const { container } = render(<VerifyPage />);
    const form = container.querySelector("form");
    expect(form).not.toBeNull();
    fireEvent.submit(form as HTMLFormElement);
    expect(mockLogic.triggerPasswordSetup).toHaveBeenCalled();
  });
});
