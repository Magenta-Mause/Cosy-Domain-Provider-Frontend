import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PasswordStrength } from "./password-strength";

// jsdom drops `background: var(...)` shorthand declarations, so the bar
// colors cannot be read back from the DOM; these tests exercise the
// weak/medium/strong branches and assert the rendered structure.
function bars(container: HTMLElement) {
  return [...(container.firstElementChild?.children ?? [])];
}

describe("PasswordStrength", () => {
  it("renders nothing for an empty password", () => {
    const { container } = render(<PasswordStrength password="" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders four bars for a weak password", () => {
    const { container } = render(<PasswordStrength password="abc" />);
    expect(bars(container)).toHaveLength(4);
  });

  it("renders four bars for a medium password", () => {
    const { container } = render(<PasswordStrength password="abcdefgh" />);
    expect(bars(container)).toHaveLength(4);
  });

  it("renders four bars for a strong password", () => {
    const { container } = render(<PasswordStrength password="abcdefghijkl" />);
    expect(bars(container)).toHaveLength(4);
  });
});
