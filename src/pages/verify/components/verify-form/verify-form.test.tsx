import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { VerifyForm } from "./verify-form";

const baseProps = {
  userEmail: "a@a.com",
  verificationToken: "",
  isVerifying: false,
  isSending: false,
  resendSent: false,
  verifyError: null as string | null,
  resendError: null as string | null,
  isBusy: false,
  onTokenChange: vi.fn(),
  onVerify: vi.fn(),
  onResend: vi.fn(),
};

beforeEach(() => vi.clearAllMocks());

describe("VerifyForm", () => {
  it("renders the code input and submit button", () => {
    render(<VerifyForm {...baseProps} />);
    expect(screen.getByTestId("verify-code-input")).toBeInTheDocument();
    expect(screen.getByTestId("verify-submit-btn")).toBeInTheDocument();
  });

  it("verifies on submit click with a full code", async () => {
    render(<VerifyForm {...baseProps} verificationToken="123456" />);
    await userEvent.click(screen.getByTestId("verify-submit-btn"));
    expect(baseProps.onVerify).toHaveBeenCalled();
  });

  it("resends the code", async () => {
    render(<VerifyForm {...baseProps} />);
    await userEvent.click(screen.getByText("Resend Verification Code"));
    expect(baseProps.onResend).toHaveBeenCalled();
  });

  it("shows the sending label while resending", () => {
    render(<VerifyForm {...baseProps} isSending />);
    expect(screen.getByText("verify.sendingBtn")).toBeInTheDocument();
  });

  it("shows the sent label after resending", () => {
    render(<VerifyForm {...baseProps} resendSent />);
    expect(screen.getByText("Code sent!")).toBeInTheDocument();
  });

  it("shows verify and resend errors", () => {
    render(
      <VerifyForm {...baseProps} verifyError="bad code" resendError="nope" />,
    );
    expect(screen.getByText(/bad code/)).toBeInTheDocument();
    expect(screen.getByText(/nope/)).toBeInTheDocument();
  });
});
