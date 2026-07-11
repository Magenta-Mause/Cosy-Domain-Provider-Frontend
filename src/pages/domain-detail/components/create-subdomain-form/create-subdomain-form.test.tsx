import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("../overview-tab/components/create-mode-fields", () => ({
  CreateModeFields: (props: {
    isPlus: boolean;
    labelInvalid: boolean;
    labelAvailability: string;
    namingMode: string;
  }) => (
    <div
      data-testid="create-mode-fields"
      data-is-plus={String(props.isPlus)}
      data-label-invalid={String(props.labelInvalid)}
      data-label-availability={props.labelAvailability}
      data-naming-mode={props.namingMode}
    />
  ),
}));

vi.mock("../overview-tab/components/target-ip-tabs", () => ({
  TargetIpTabs: (props: { activeTab: string; atLeastOneIp: boolean }) => (
    <div
      data-testid="target-ip-tabs"
      data-active-tab={props.activeTab}
      data-at-least-one-ip={String(props.atLeastOneIp)}
    />
  ),
}));

vi.mock("../overview-tab/components/overview-actions", () => ({
  OverviewActions: (props: { canSubmit: boolean; isCreateMode: boolean }) => (
    <div
      data-testid="overview-actions"
      data-can-submit={String(props.canSubmit)}
      data-is-create-mode={String(props.isCreateMode)}
    />
  ),
}));

import { CreateSubdomainForm } from "./create-subdomain-form";

const baseProps = {
  isPlus: true,
  isVerified: true,
  label: "castle",
  onLabelChange: vi.fn(),
  targetIp: "192.0.2.1",
  onTargetIpChange: vi.fn(),
  targetIpv6: "",
  onTargetIpv6Change: vi.fn(),
  ipTab: "ipv4" as const,
  onIpTabChange: vi.fn(),
  errorMessage: null as string | null,
  isSubmitting: false,
  isDeleting: false,
  hasSubmitted: false,
  labelValid: true,
  labelAvailability: "available" as const,
  namingMode: "custom" as const,
  onNamingModeChange: vi.fn(),
  ipv4Valid: true,
  ipv6Valid: true,
  atLeastOneIp: true,
  canSubmit: true,
  onSubmit: vi.fn((e: React.SyntheticEvent) => e.preventDefault()),
};

describe("CreateSubdomainForm", () => {
  it("renders the child field groups and the create-mode actions", () => {
    render(<CreateSubdomainForm {...baseProps} />);
    expect(screen.getByTestId("create-mode-fields")).toBeInTheDocument();
    expect(screen.getByTestId("target-ip-tabs")).toBeInTheDocument();
    const actions = screen.getByTestId("overview-actions");
    expect(actions).toHaveAttribute("data-is-create-mode", "true");
    expect(actions).toHaveAttribute("data-can-submit", "true");
    expect(screen.getByText("domainDetail.formLegend")).toBeInTheDocument();
  });

  it("forwards prop values down to the field groups", () => {
    render(<CreateSubdomainForm {...baseProps} />);
    const fields = screen.getByTestId("create-mode-fields");
    expect(fields).toHaveAttribute("data-is-plus", "true");
    expect(fields).toHaveAttribute("data-label-availability", "available");
    expect(fields).toHaveAttribute("data-naming-mode", "custom");
    expect(screen.getByTestId("target-ip-tabs")).toHaveAttribute(
      "data-active-tab",
      "ipv4",
    );
  });

  it("marks the label invalid only after submit with an invalid custom label", () => {
    const { rerender } = render(<CreateSubdomainForm {...baseProps} />);
    expect(screen.getByTestId("create-mode-fields")).toHaveAttribute(
      "data-label-invalid",
      "false",
    );

    rerender(
      <CreateSubdomainForm
        {...baseProps}
        hasSubmitted
        labelValid={false}
        namingMode="custom"
      />,
    );
    expect(screen.getByTestId("create-mode-fields")).toHaveAttribute(
      "data-label-invalid",
      "true",
    );
  });

  it("does not mark the label invalid in random naming mode", () => {
    render(
      <CreateSubdomainForm
        {...baseProps}
        hasSubmitted
        labelValid={false}
        namingMode="random"
      />,
    );
    expect(screen.getByTestId("create-mode-fields")).toHaveAttribute(
      "data-label-invalid",
      "false",
    );
  });

  it("renders the error message when provided", () => {
    const { rerender } = render(<CreateSubdomainForm {...baseProps} />);
    expect(screen.queryByText(/boom/)).not.toBeInTheDocument();

    rerender(<CreateSubdomainForm {...baseProps} errorMessage="boom" />);
    expect(screen.getByText(/boom/)).toBeInTheDocument();
  });

  it("calls onSubmit when the form is submitted", () => {
    const onSubmit = vi.fn((e: React.SyntheticEvent) => e.preventDefault());
    const { container } = render(
      <CreateSubdomainForm {...baseProps} onSubmit={onSubmit} />,
    );
    fireEvent.submit(container.querySelector("form") as HTMLFormElement);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("disables the fieldset while submitting or deleting", () => {
    const { container, rerender } = render(
      <CreateSubdomainForm {...baseProps} isSubmitting />,
    );
    expect(container.querySelector("fieldset")).toBeDisabled();

    rerender(<CreateSubdomainForm {...baseProps} isDeleting />);
    expect(container.querySelector("fieldset")).toBeDisabled();
  });
});
