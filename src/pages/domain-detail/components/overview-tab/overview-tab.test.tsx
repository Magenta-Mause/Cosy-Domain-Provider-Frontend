import { fireEvent, render, screen } from "@testing-library/react";
import type { SyntheticEvent } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("./components/domain-meta-cards", () => ({
  DomainMetaCards: ({ createdAt }: { createdAt: string }) => (
    <div data-testid="domain-meta-cards">{createdAt}</div>
  ),
}));

vi.mock("./components/overview-actions", () => ({
  OverviewActions: ({
    canSubmit,
    isCreateMode,
  }: {
    canSubmit: boolean;
    isCreateMode: boolean;
  }) => (
    <button
      type="submit"
      data-testid="overview-actions"
      data-can-submit={canSubmit}
      data-create-mode={isCreateMode}
    >
      submit
    </button>
  ),
}));

vi.mock("./components/readonly-label-field", () => ({
  ReadonlyLabelField: ({ label }: { label: string }) => (
    <div data-testid="readonly-label-field">{label}</div>
  ),
}));

vi.mock("./components/target-ip-tabs", () => ({
  TargetIpTabs: ({ activeTab }: { activeTab: string }) => (
    <div data-testid="target-ip-tabs">{activeTab}</div>
  ),
}));

import { OverviewTab } from "./overview-tab";

const baseProps = {
  domain: undefined,
  label: "my-castle",
  targetIp: "",
  onTargetIpChange: vi.fn(),
  targetIpv6: "",
  onTargetIpv6Change: vi.fn(),
  ipTab: "ipv4" as const,
  onIpTabChange: vi.fn(),
  errorMessage: null,
  isSubmitting: false,
  isDeleting: false,
  hasSubmitted: false,
  ipv4Valid: true,
  ipv6Valid: true,
  atLeastOneIp: true,
  canSubmit: true,
  createdAt: "Jan 1, 2026",
  onSubmit: vi.fn((e: SyntheticEvent<HTMLFormElement>) => e.preventDefault()),
};

beforeEach(() => vi.clearAllMocks());

describe("OverviewTab", () => {
  it("renders all child sections", () => {
    render(<OverviewTab {...baseProps} />);
    expect(screen.getByTestId("domain-meta-cards")).toHaveTextContent(
      "Jan 1, 2026",
    );
    expect(screen.getByTestId("readonly-label-field")).toHaveTextContent(
      "my-castle",
    );
    expect(screen.getByTestId("target-ip-tabs")).toHaveTextContent("ipv4");
    expect(screen.getByTestId("overview-actions")).toBeInTheDocument();
  });

  it("passes canSubmit and edit mode to the actions", () => {
    render(<OverviewTab {...baseProps} />);
    const actions = screen.getByTestId("overview-actions");
    expect(actions).toHaveAttribute("data-can-submit", "true");
    expect(actions).toHaveAttribute("data-create-mode", "false");
  });

  it("calls onSubmit when the form is submitted", () => {
    render(<OverviewTab {...baseProps} />);
    fireEvent.submit(screen.getByTestId("overview-actions"));
    expect(baseProps.onSubmit).toHaveBeenCalledTimes(1);
  });

  it("does not render an error message by default", () => {
    render(<OverviewTab {...baseProps} />);
    expect(screen.queryByText("Something broke")).not.toBeInTheDocument();
  });

  it("renders the error message when present", () => {
    render(<OverviewTab {...baseProps} errorMessage="Something broke" />);
    expect(screen.getByText(/Something broke/)).toBeInTheDocument();
  });

  it("disables the fieldset while submitting", () => {
    const { container } = render(<OverviewTab {...baseProps} isSubmitting />);
    expect(container.querySelector("fieldset")).toBeDisabled();
  });

  it("disables the fieldset while deleting", () => {
    const { container } = render(<OverviewTab {...baseProps} isDeleting />);
    expect(container.querySelector("fieldset")).toBeDisabled();
  });

  it("enables the fieldset when idle", () => {
    const { container } = render(<OverviewTab {...baseProps} />);
    expect(container.querySelector("fieldset")).toBeEnabled();
  });
});
