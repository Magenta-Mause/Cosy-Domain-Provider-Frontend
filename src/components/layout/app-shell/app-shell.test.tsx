import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", () => ({
  Outlet: () => <div data-testid="outlet" />,
}));

vi.mock("../app-footer", () => ({
  AppFooter: () => <footer data-testid="app-footer" />,
}));

import { AppShell } from "./app-shell";

describe("AppShell", () => {
  it("renders the routed outlet and the footer together", () => {
    render(<AppShell />);
    expect(screen.getByTestId("outlet")).toBeInTheDocument();
    expect(screen.getByTestId("app-footer")).toBeInTheDocument();
  });
});
