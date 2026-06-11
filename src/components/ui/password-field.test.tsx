import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { PasswordField } from "./password-field";

describe("PasswordField", () => {
  it("renders a password input with its label", () => {
    render(
      <PasswordField
        id="pw"
        label="Password"
        value=""
        onChange={() => {}}
        testId="pw-input"
      />,
    );

    expect(screen.getByTestId("pw-input")).toHaveAttribute("type", "password");
    expect(screen.getByLabelText("Password")).toBe(
      screen.getByTestId("pw-input"),
    );
  });

  it("toggles visibility via the eye button", async () => {
    render(
      <PasswordField
        id="pw"
        label="Password"
        value="secret"
        onChange={() => {}}
        testId="pw-input"
        toggleTestId="pw-toggle"
      />,
    );

    const toggle = screen.getByTestId("pw-toggle");
    expect(toggle).toHaveAttribute("aria-label", "Show password");

    await userEvent.click(toggle);
    expect(screen.getByTestId("pw-input")).toHaveAttribute("type", "text");
    expect(toggle).toHaveAttribute("aria-label", "Hide password");

    await userEvent.click(toggle);
    expect(screen.getByTestId("pw-input")).toHaveAttribute("type", "password");
  });

  it("propagates changes and the error message", async () => {
    const onChange = vi.fn();
    render(
      <PasswordField
        id="pw"
        label="Password"
        value=""
        onChange={onChange}
        error="Too short"
        testId="pw-input"
      />,
    );

    await userEvent.type(screen.getByTestId("pw-input"), "a");
    expect(onChange).toHaveBeenCalledWith("a");
    expect(screen.getByText(/Too short/)).toBeInTheDocument();
  });
});
