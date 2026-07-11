import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DetailField } from "./detail-field";

describe("DetailField", () => {
  it("renders the label and children", () => {
    render(
      <DetailField label="Owner">
        <span>alice</span>
      </DetailField>,
    );
    expect(screen.getByText("Owner")).toBeInTheDocument();
    expect(screen.getByText("alice")).toBeInTheDocument();
  });

  it("renders arbitrary ReactNode children", () => {
    render(
      <DetailField label="Actions">
        <button type="button">Click</button>
      </DetailField>,
    );
    expect(screen.getByRole("button", { name: "Click" })).toBeInTheDocument();
  });
});
