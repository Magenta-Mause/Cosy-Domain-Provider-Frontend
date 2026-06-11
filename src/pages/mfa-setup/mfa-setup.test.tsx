import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/components/auth/auth-page-layout", () => ({
  AuthPageLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-layout">{children}</div>
  ),
}));

vi.mock("@/components/ui/input-otp", () => ({
  InputOTP: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="otp-input">{children}</div>
  ),
  InputOTPGroup: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  InputOTPSeparator: () => <span />,
  InputOTPSlot: () => <span />,
}));

vi.mock("qrcode.react", () => ({
  QRCodeSVG: (props: { value: string }) => (
    <svg data-testid="qr-code" aria-label={props.value} />
  ),
}));

const defaultLogic = {
  totpUri: "otpauth://totp/x",
  secret: "SECRET123",
  totpCode: "",
  setTotpCode: vi.fn(),
  isLoading: false,
  isConfirming: false,
  setupError: null as string | null,
  confirmError: null as string | null,
  handleConfirm: vi.fn(),
};

let mockLogic = { ...defaultLogic };

vi.mock("./useMfaSetupLogic", () => ({
  useMfaSetupLogic: () => mockLogic,
}));

import { MfaSetupForm } from "./components/mfa-setup-form";
import { MfaSetupPage } from "./index";

beforeEach(() => {
  vi.clearAllMocks();
  mockLogic = { ...defaultLogic };
});

describe("MfaSetupPage", () => {
  it("renders the setup form inside the auth layout", () => {
    render(<MfaSetupPage />);
    expect(screen.getByTestId("auth-layout")).toBeInTheDocument();
    expect(screen.getByTestId("qr-code")).toBeInTheDocument();
  });
});

describe("MfaSetupForm", () => {
  it("shows the QR code and manual secret", () => {
    render(<MfaSetupForm />);
    expect(screen.getByTestId("qr-code")).toBeInTheDocument();
    expect(screen.getByTestId("mfa-secret")).toHaveTextContent("SECRET123");
  });

  it("shows a loading state", () => {
    mockLogic = { ...defaultLogic, isLoading: true };
    render(<MfaSetupForm />);
    expect(screen.queryByTestId("qr-code")).not.toBeInTheDocument();
  });

  it("shows the setup error", () => {
    mockLogic = { ...defaultLogic, setupError: "setup failed" };
    render(<MfaSetupForm />);
    expect(screen.getByText(/setup failed/)).toBeInTheDocument();
  });

  it("confirms with a complete code", async () => {
    mockLogic = { ...defaultLogic, totpCode: "123456" };
    render(<MfaSetupForm />);
    await userEvent.click(screen.getByTestId("mfa-confirm-btn"));
    expect(defaultLogic.handleConfirm).toHaveBeenCalled();
  });
});
