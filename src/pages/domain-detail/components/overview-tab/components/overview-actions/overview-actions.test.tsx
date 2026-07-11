import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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

import { OverviewActions } from "./overview-actions";

const baseProps = {
  canSubmit: true,
  isSubmitting: false,
  isCreateMode: false,
};

describe("OverviewActions", () => {
  it("renders the back link pointing at the dashboard", () => {
    render(<OverviewActions {...baseProps} />);
    expect(screen.getByTestId("domain-detail-back-btn")).toHaveAttribute(
      "href",
      "/dashboard",
    );
  });

  it("shows the save action in edit mode", () => {
    render(<OverviewActions {...baseProps} />);
    expect(screen.getByTestId("domain-detail-submit-btn")).toHaveTextContent(
      "domainDetail.saveAction",
    );
  });

  it("shows the create action in create mode", () => {
    render(<OverviewActions {...baseProps} isCreateMode />);
    expect(screen.getByTestId("domain-detail-submit-btn")).toHaveTextContent(
      "domainDetail.createAction",
    );
  });

  it("shows the saving label while submitting", () => {
    render(<OverviewActions {...baseProps} isSubmitting />);
    expect(screen.getByTestId("domain-detail-submit-btn")).toHaveTextContent(
      "domainDetail.saving",
    );
  });

  it("disables the submit button when submit is not allowed", () => {
    render(<OverviewActions {...baseProps} canSubmit={false} />);
    expect(screen.getByTestId("domain-detail-submit-btn")).toBeDisabled();
  });

  it("enables the submit button when submit is allowed", () => {
    render(<OverviewActions {...baseProps} />);
    expect(screen.getByTestId("domain-detail-submit-btn")).toBeEnabled();
  });
});
