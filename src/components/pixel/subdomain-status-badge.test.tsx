import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { SubdomainDtoStatus } from "@/api/generated/model";
import { SubdomainStatusBadge } from "./subdomain-status-badge";

describe("SubdomainStatusBadge", () => {
  it("renders the active badge", () => {
    render(<SubdomainStatusBadge status={SubdomainDtoStatus.ACTIVE} />);
    expect(screen.getByText("status.active")).toBeInTheDocument();
  });

  it("renders the detail variant for active", () => {
    render(
      <SubdomainStatusBadge
        status={SubdomainDtoStatus.ACTIVE}
        variant="detail"
      />,
    );
    expect(screen.getByText("status.tlsActive")).toBeInTheDocument();
  });

  it("renders the pending badge in both variants", () => {
    render(<SubdomainStatusBadge status={SubdomainDtoStatus.PENDING} />);
    expect(screen.getByText(/status.pending/)).toBeInTheDocument();
    render(
      <SubdomainStatusBadge
        status={SubdomainDtoStatus.PENDING}
        variant="detail"
      />,
    );
    expect(screen.getByText(/status.awaitingVerify/)).toBeInTheDocument();
  });

  it("renders the failed badge", () => {
    render(<SubdomainStatusBadge status={SubdomainDtoStatus.FAILED} />);
    expect(screen.getByText(/status.failed/)).toBeInTheDocument();
  });
});
