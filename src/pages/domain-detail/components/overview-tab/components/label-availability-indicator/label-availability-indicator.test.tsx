import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { LabelAvailabilityIndicator } from "./label-availability-indicator";

describe("LabelAvailabilityIndicator", () => {
  it("renders nothing when idle", () => {
    const { container } = render(
      <LabelAvailabilityIndicator availability="idle" />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the checking message", () => {
    render(<LabelAvailabilityIndicator availability="checking" />);
    expect(
      screen.getByText("createSubdomain.labelChecking"),
    ).toBeInTheDocument();
  });

  it("shows the available message with a check mark", () => {
    render(<LabelAvailabilityIndicator availability="available" />);
    expect(
      screen.getByText(/createSubdomain.labelAvailable/),
    ).toBeInTheDocument();
  });

  it("shows the taken error", () => {
    render(<LabelAvailabilityIndicator availability="taken" />);
    expect(screen.getByText(/createSubdomain.labelTaken/)).toBeInTheDocument();
  });

  it("shows the reserved error", () => {
    render(<LabelAvailabilityIndicator availability="reserved" />);
    expect(
      screen.getByText(/createSubdomain.labelReserved/),
    ).toBeInTheDocument();
  });
});
