import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { UserStats } from "./user-stats";

describe("UserStats", () => {
  it("renders all three stat labels and their sub-labels", () => {
    render(<UserStats total={12} unverified={3} plus={5} />);

    expect(screen.getByText("admin.statUserTotal")).toBeInTheDocument();
    expect(screen.getByText("admin.statUserTotalSub")).toBeInTheDocument();
    expect(screen.getByText("admin.statUserUnverified")).toBeInTheDocument();
    expect(screen.getByText("admin.statUserUnverifiedSub")).toBeInTheDocument();
    expect(screen.getByText("admin.statUserPlus")).toBeInTheDocument();
    expect(screen.getByText("admin.statUserPlusSub")).toBeInTheDocument();
  });

  it("renders the numeric values passed in", () => {
    render(<UserStats total={12} unverified={3} plus={5} />);

    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("colors the total, unverified and plus values distinctly", () => {
    render(<UserStats total={7} unverified={8} plus={9} />);

    expect(screen.getByText("7").className).toContain("text-btn-primary");
    expect(screen.getByText("8").className).toContain("text-orange-500");
    expect(screen.getByText("9").className).toContain("text-green-600");
  });
});
