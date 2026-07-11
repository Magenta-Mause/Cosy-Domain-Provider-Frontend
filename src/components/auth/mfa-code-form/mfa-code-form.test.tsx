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

import { MfaCodeForm } from "./mfa-code-form";

const baseProps = {
  totpCode: "123456",
  setTotpCode: vi.fn(),
  totpError: null as string | null,
  isSubmitting: false,
  onConfirm: vi.fn(),
  otpTestId: "totp-input",
  submitTestId: "totp-submit",
};

beforeEach(() => vi.clearAllMocks());

describe("MfaCodeForm", () => {
  it("renders header, footer, input and submit", () => {
    render(
      <MfaCodeForm
        {...baseProps}
        header={<div data-testid="header-slot" />}
        footer={<div data-testid="footer-slot" />}
      />,
    );
    expect(screen.getByTestId("header-slot")).toBeInTheDocument();
    expect(screen.getByTestId("footer-slot")).toBeInTheDocument();
    expect(screen.getByTestId("totp-input")).toBeInTheDocument();
  });

  it("confirms with a complete code", async () => {
    render(<MfaCodeForm {...baseProps} />);
    await userEvent.click(screen.getByTestId("totp-submit"));
    expect(baseProps.onConfirm).toHaveBeenCalled();
  });

  it("shows the TOTP error", () => {
    render(<MfaCodeForm {...baseProps} totpError="wrong code" />);
    expect(screen.getByText(/wrong code/)).toBeInTheDocument();
  });
});
