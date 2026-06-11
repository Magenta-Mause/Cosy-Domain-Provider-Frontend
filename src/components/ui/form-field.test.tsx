import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FormField } from "./form-field";

describe("FormField", () => {
  it("wires label and input together and propagates changes", async () => {
    const onChange = vi.fn();
    render(
      <FormField
        id="name"
        label="Name"
        value=""
        onChange={onChange}
        testId="name-input"
      />,
    );

    const input = screen.getByLabelText("Name");
    expect(input).toBe(screen.getByTestId("name-input"));
    await userEvent.type(input, "a");
    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("renders the suffix and reserves padding for it", () => {
    render(
      <FormField
        id="label"
        label="Label"
        value=""
        onChange={() => {}}
        suffix=".play.cosy-hosting.net"
      />,
    );

    expect(screen.getByText(".play.cosy-hosting.net")).toBeInTheDocument();
    expect(screen.getByLabelText("Label").style.paddingRight).not.toBe("");
  });

  it("hides the suffix below sm with responsiveSuffix", () => {
    render(
      <FormField
        id="label"
        label="Label"
        value=""
        onChange={() => {}}
        suffix=".play.cosy-hosting.net"
        responsiveSuffix
      />,
    );

    expect(screen.getByText(".play.cosy-hosting.net").className).toContain(
      "hidden sm:block",
    );
    const input = screen.getByLabelText("Label");
    expect(input.className).toContain("sm:pr-[var(--suffix-pr)]");
    expect(input.style.paddingRight).toBe("");
  });

  it("shows the error message and marks the input invalid", () => {
    render(
      <FormField
        id="email"
        label="Email"
        value=""
        onChange={() => {}}
        error="Invalid email"
        hint="We never share it"
      />,
    );

    expect(screen.getByText(/Invalid email/)).toBeInTheDocument();
    expect(screen.getByLabelText("Email").className).toContain("invalid");
    // hint is suppressed while an error is shown
    expect(screen.queryByText("We never share it")).not.toBeInTheDocument();
  });

  it("shows the hint when there is no error", () => {
    render(
      <FormField
        id="email"
        label="Email"
        value=""
        onChange={() => {}}
        hint="We never share it"
      />,
    );

    expect(screen.getByText("We never share it")).toBeInTheDocument();
  });

  it("reserves space for an endDecorator", () => {
    render(
      <FormField
        id="pw"
        label="Password"
        value=""
        onChange={() => {}}
        endDecorator={<button type="button">eye</button>}
      />,
    );

    expect(screen.getByText("eye")).toBeInTheDocument();
    expect(screen.getByLabelText("Password").className).toContain("pr-12");
  });
});
