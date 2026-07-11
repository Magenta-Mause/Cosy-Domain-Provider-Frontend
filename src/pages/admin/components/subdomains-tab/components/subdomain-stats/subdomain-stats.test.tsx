import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { SubdomainStats } from "./subdomain-stats";

describe("SubdomainStats", () => {
  it("renders the total, failed and derived active counts", () => {
    render(<SubdomainStats total={10} failed={3} />);
    expect(screen.getByText("admin.statTotal")).toBeInTheDocument();
    expect(screen.getByText("admin.statFailed")).toBeInTheDocument();
    expect(screen.getByText("admin.statActive")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    // active = total - failed
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("computes zero active when all subdomains failed", () => {
    render(<SubdomainStats total={4} failed={4} />);
    // both total-failed and the failed value equal 4, so two nodes show "4"
    expect(screen.getAllByText("4")).toHaveLength(2);
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
