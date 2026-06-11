import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./input-otp";

function renderOtp(onChange = vi.fn()) {
  render(
    <InputOTP maxLength={6} value="" onChange={onChange} data-testid="otp">
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>,
  );
  return onChange;
}

describe("InputOTP", () => {
  it("renders the input with its slots", () => {
    renderOtp();
    expect(screen.getByTestId("otp")).toBeInTheDocument();
  });

  it("forwards typed characters to onChange", async () => {
    const onChange = renderOtp();
    await userEvent.type(screen.getByTestId("otp"), "1");
    expect(onChange).toHaveBeenCalledWith("1");
  });
});
