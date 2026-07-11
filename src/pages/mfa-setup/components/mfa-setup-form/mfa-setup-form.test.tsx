import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("qrcode.react", () => ({
  QRCodeSVG: ({ value, ...rest }: { value: string }) => (
    <svg data-value={value} {...rest} />
  ),
}));

const useMfaSetupLogic = vi.fn();
vi.mock("../../useMfaSetupLogic", () => ({
  useMfaSetupLogic: () => useMfaSetupLogic(),
}));

import { MfaSetupForm } from "./mfa-setup-form";

const baseLogic = {
  totpUri: "otpauth://totp/x",
  secret: "SECRETCODE",
  totpCode: "",
  setTotpCode: vi.fn(),
  isLoading: false,
  isConfirming: false,
  setupError: null as string | null,
  confirmError: null as string | null,
  handleConfirm: vi.fn(),
};

beforeEach(() => vi.clearAllMocks());

describe("MfaSetupForm", () => {
  it("shows a loading state while setup is in flight", () => {
    useMfaSetupLogic.mockReturnValue({ ...baseLogic, isLoading: true });
    render(<MfaSetupForm />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByTestId("mfa-qr-code")).not.toBeInTheDocument();
  });

  it("shows the setup error and no form", () => {
    useMfaSetupLogic.mockReturnValue({
      ...baseLogic,
      setupError: "setup failed",
    });
    render(<MfaSetupForm />);
    expect(screen.getByText(/setup failed/)).toBeInTheDocument();
    expect(screen.queryByTestId("mfa-confirm-btn")).not.toBeInTheDocument();
  });

  it("renders the QR code, secret and OTP input", () => {
    useMfaSetupLogic.mockReturnValue(baseLogic);
    render(<MfaSetupForm />);
    expect(screen.getByTestId("mfa-qr-code")).toBeInTheDocument();
    expect(screen.getByTestId("mfa-secret")).toHaveTextContent("SECRETCODE");
    expect(screen.getByTestId("mfa-totp-input")).toBeInTheDocument();
    expect(screen.getByText("mfaSetup.title")).toBeInTheDocument();
  });

  it("disables the confirm button until six digits are entered", () => {
    useMfaSetupLogic.mockReturnValue({ ...baseLogic, totpCode: "123" });
    render(<MfaSetupForm />);
    expect(screen.getByTestId("mfa-confirm-btn")).toBeDisabled();
  });

  it("enables the confirm button and calls handleConfirm on click", async () => {
    useMfaSetupLogic.mockReturnValue({ ...baseLogic, totpCode: "123456" });
    render(<MfaSetupForm />);
    const btn = screen.getByTestId("mfa-confirm-btn");
    expect(btn).toBeEnabled();
    await userEvent.click(btn);
    expect(baseLogic.handleConfirm).toHaveBeenCalled();
  });

  it("shows the confirm error and submitting label while confirming", () => {
    useMfaSetupLogic.mockReturnValue({
      ...baseLogic,
      totpCode: "123456",
      isConfirming: true,
      confirmError: "bad code",
    });
    render(<MfaSetupForm />);
    expect(screen.getByText(/bad code/)).toBeInTheDocument();
    expect(screen.getByTestId("mfa-confirm-btn")).toHaveTextContent(
      "mfaSetup.submitting",
    );
    expect(screen.getByTestId("mfa-confirm-btn")).toBeDisabled();
  });
});
