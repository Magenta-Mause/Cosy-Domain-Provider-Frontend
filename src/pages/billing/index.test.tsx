import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, ...rest }: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a {...rest}>{children}</a>
  ),
}));

vi.mock("@/components/layout/page-header", () => ({
  PageHeader: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="page-header">{children}</div>
  ),
}));

const defaultLogic = {
  isPlus: false,
  isVerified: true,
  isRedirecting: false,
  error: null as string | null,
  handlePortalClick: vi.fn(),
};

let mockLogic = { ...defaultLogic };

vi.mock("./useBillingLogic", () => ({
  useBillingLogic: () => mockLogic,
}));

import { BillingPage } from "./index";

beforeEach(() => {
  vi.clearAllMocks();
  mockLogic = { ...defaultLogic };
});

describe("BillingPage", () => {
  it("shows the free plan with upgrade button", () => {
    render(<BillingPage />);
    expect(screen.getByText("billing.free")).toBeInTheDocument();
    expect(screen.getByText("billing.upgradeButton")).toBeInTheDocument();
  });

  it("shows the plus plan with manage button", () => {
    mockLogic = { ...defaultLogic, isPlus: true };
    render(<BillingPage />);
    expect(screen.getByText("billing.plus")).toBeInTheDocument();
    expect(screen.getByText("billing.manageButton")).toBeInTheDocument();
  });

  it("shows the redirecting label", () => {
    mockLogic = { ...defaultLogic, isRedirecting: true };
    render(<BillingPage />);
    expect(screen.getByText("billing.redirecting")).toBeInTheDocument();
  });

  it("shows errors", () => {
    mockLogic = { ...defaultLogic, error: "billing failed" };
    render(<BillingPage />);
    expect(screen.getByText(/billing failed/)).toBeInTheDocument();
  });

  it("opens the portal on click", async () => {
    render(<BillingPage />);
    await userEvent.click(screen.getByText("billing.upgradeButton"));
    expect(mockLogic.handlePortalClick).toHaveBeenCalled();
  });
});
