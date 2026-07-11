import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { ReadonlyLabelField } from "./readonly-label-field";

describe("ReadonlyLabelField", () => {
  it("renders the label value in a read-only, disabled input", () => {
    render(<ReadonlyLabelField label="my-castle" />);
    const input = screen.getByTestId(
      "domain-detail-label-input",
    ) as HTMLInputElement;
    expect(input.value).toBe("my-castle");
    expect(input).toHaveAttribute("readonly");
    expect(input).toBeDisabled();
  });

  it("falls back to the default suffix when no fqdn is provided", () => {
    render(<ReadonlyLabelField label="my-castle" />);
    expect(screen.getByText(".play.cosy-hosting.net")).toBeInTheDocument();
  });

  it("derives the suffix from the fqdn", () => {
    render(
      <ReadonlyLabelField label="my-castle" fqdn="my-castle.dev.example.com" />,
    );
    expect(screen.getByText(".dev.example.com")).toBeInTheDocument();
  });

  it("shows the readonly hint", () => {
    render(<ReadonlyLabelField label="my-castle" />);
    expect(screen.getByText("domainDetail.labelReadonly")).toBeInTheDocument();
  });
});
