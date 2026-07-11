import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    children,
    ...rest
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("../plan-card", () => ({
  PlanCard: ({
    label,
    selected,
    onClick,
  }: {
    label: string;
    selected: boolean;
    onClick: () => void;
  }) => (
    <button type="button" onClick={onClick} data-selected={selected}>
      {label}
    </button>
  ),
}));

vi.mock("../label-availability-indicator", () => ({
  LabelAvailabilityIndicator: ({ availability }: { availability: string }) => (
    <div data-testid="availability">{availability}</div>
  ),
}));

import { CreateModeFields } from "./create-mode-fields";

const baseProps = {
  isPlus: false,
  isVerified: true,
  label: "",
  onLabelChange: vi.fn(),
  labelInvalid: false,
  labelAvailability: "idle" as const,
  namingMode: "random" as const,
  onNamingModeChange: vi.fn(),
};

beforeEach(() => vi.clearAllMocks());

describe("CreateModeFields", () => {
  it("renders both plan cards", () => {
    render(<CreateModeFields {...baseProps} />);
    expect(screen.getByText("createSubdomain.randomName")).toBeInTheDocument();
    expect(screen.getByText("createSubdomain.customName")).toBeInTheDocument();
  });

  it("switches the naming mode when a plan card is clicked", async () => {
    render(<CreateModeFields {...baseProps} />);
    await userEvent.click(screen.getByText("createSubdomain.customName"));
    expect(baseProps.onNamingModeChange).toHaveBeenCalledWith("custom");
  });

  it("prompts to upgrade for verified non-plus users in custom mode", () => {
    render(
      <CreateModeFields {...baseProps} namingMode="custom" isVerified={true} />,
    );
    expect(
      screen.getByText("createSubdomain.upgradeRequired"),
    ).toBeInTheDocument();
    const cta = screen.getByText("createSubdomain.upgradeBtn");
    expect(cta).toHaveAttribute("href", "/billing");
  });

  it("prompts to verify for unverified users in custom mode", () => {
    render(
      <CreateModeFields
        {...baseProps}
        namingMode="custom"
        isVerified={false}
      />,
    );
    expect(screen.getByText("createSubdomain.verifyFirst")).toBeInTheDocument();
    const cta = screen.getByText("createSubdomain.verifyBtn");
    expect(cta).toHaveAttribute("href", "/verify");
  });

  it("shows the label input and availability indicator for plus users", () => {
    render(<CreateModeFields {...baseProps} namingMode="custom" isPlus />);
    expect(screen.getByTestId("domain-detail-label-input")).toBeInTheDocument();
    expect(screen.getByTestId("availability")).toBeInTheDocument();
  });

  it("normalizes label input to lowercase and dashes", () => {
    render(<CreateModeFields {...baseProps} namingMode="custom" isPlus />);
    fireEvent.change(screen.getByTestId("domain-detail-label-input"), {
      target: { value: "My Castle" },
    });
    expect(baseProps.onLabelChange).toHaveBeenCalledWith("my-castle");
  });

  it("shows the invalid label error only when availability is idle", () => {
    render(
      <CreateModeFields
        {...baseProps}
        namingMode="custom"
        isPlus
        labelInvalid
        labelAvailability="idle"
      />,
    );
    expect(screen.getByText(/domainDetail.labelInvalid/)).toBeInTheDocument();
  });
});
