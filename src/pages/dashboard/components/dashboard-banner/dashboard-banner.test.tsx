import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/components/layout/page-header", () => ({
  PageHeader: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="page-header">{children}</div>
  ),
}));

import { DashboardBanner } from "./dashboard-banner";

const baseProps = {
  isVerified: true,
  isMfaEnabled: true,
  isSlotsExhausted: false,
  domainCreationEnabled: true,
  userTier: "FREE" as const,
  onCreateNew: vi.fn(),
};

describe("DashboardBanner", () => {
  it("renders the create-new label when verified with MFA", () => {
    render(<DashboardBanner {...baseProps} />);

    const btn = screen.getByTestId("dashboard-create-new-btn");
    expect(btn).toHaveTextContent("dashboard.createNew");
    expect(btn).not.toBeDisabled();
  });

  it("prompts to verify the account when unverified", () => {
    render(<DashboardBanner {...baseProps} isVerified={false} />);

    expect(screen.getByTestId("dashboard-create-new-btn")).toHaveTextContent(
      "dashboard.verifyAccount",
    );
  });

  it("prompts to set up MFA when verified without MFA", () => {
    render(<DashboardBanner {...baseProps} isMfaEnabled={false} />);

    expect(screen.getByTestId("dashboard-create-new-btn")).toHaveTextContent(
      "dashboard.setupMfa",
    );
  });

  it("calls onCreateNew when the button is clicked", async () => {
    const onCreateNew = vi.fn();
    render(<DashboardBanner {...baseProps} onCreateNew={onCreateNew} />);

    await userEvent.click(screen.getByTestId("dashboard-create-new-btn"));
    expect(onCreateNew).toHaveBeenCalledTimes(1);
  });

  it("disables the button and shows the free tier exhausted tooltip", () => {
    render(<DashboardBanner {...baseProps} isSlotsExhausted={true} />);

    expect(screen.getByTestId("dashboard-create-new-btn")).toBeDisabled();
    expect(
      screen.getByText("dashboard.slotsExhaustedFree"),
    ).toBeInTheDocument();
  });

  it("shows the plus tier exhausted tooltip for PLUS users", () => {
    render(
      <DashboardBanner
        {...baseProps}
        userTier="PLUS"
        isSlotsExhausted={true}
      />,
    );

    expect(
      screen.getByText("dashboard.slotsExhaustedPlus"),
    ).toBeInTheDocument();
  });

  it("disables the button and shows the creation-disabled tooltip", () => {
    render(<DashboardBanner {...baseProps} domainCreationEnabled={false} />);

    expect(screen.getByTestId("dashboard-create-new-btn")).toBeDisabled();
    expect(screen.getByText("dashboard.creationDisabled")).toBeInTheDocument();
  });
});
