import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusBadge } from "./status-badge";

describe("StatusBadge", () => {
  it("renders the ACTIVE status in green", () => {
    render(<StatusBadge status="ACTIVE" />);
    const badge = screen.getByText("ACTIVE");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("text-green-600");
  });

  it("renders the FAILED status in destructive color", () => {
    render(<StatusBadge status="FAILED" />);
    const badge = screen.getByText("FAILED");
    expect(badge).toHaveClass("text-destructive");
  });

  it("renders other statuses in the fallback yellow color", () => {
    render(<StatusBadge status="PENDING" />);
    const badge = screen.getByText("PENDING");
    expect(badge).toHaveClass("text-yellow-400");
  });
});
