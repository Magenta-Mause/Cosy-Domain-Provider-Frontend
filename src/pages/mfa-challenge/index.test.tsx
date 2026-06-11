import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/auth/auth-page-layout", () => ({
  AuthPageLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-layout">{children}</div>
  ),
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

const mockLogic = {
  totpCode: "",
  setTotpCode: vi.fn(),
  totpError: null,
  isSubmitting: false,
  handleConfirm: vi.fn(),
};

vi.mock("./useMfaChallengeLogic", () => ({
  useMfaChallengeLogic: () => mockLogic,
}));

import { MfaChallengePage } from "./index";

describe("MfaChallengePage", () => {
  it("renders the MFA code form inside the auth layout", () => {
    render(<MfaChallengePage />);
    expect(screen.getByTestId("auth-layout")).toBeInTheDocument();
    expect(screen.getByTestId("mfa-challenge-totp-input")).toBeInTheDocument();
  });

  it("confirms the code via the form callback", async () => {
    render(<MfaChallengePage />);
    await userEvent.click(screen.getByTestId("mock-mfa-confirm"));
    expect(mockLogic.handleConfirm).toHaveBeenCalled();
  });
});
