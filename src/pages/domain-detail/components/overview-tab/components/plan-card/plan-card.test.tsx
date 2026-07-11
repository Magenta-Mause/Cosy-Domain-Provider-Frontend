import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PlanCard } from "./plan-card";

const baseProps = {
  selected: false,
  onClick: vi.fn(),
  badge: <span>my-badge</span>,
  label: "Random name",
};

beforeEach(() => vi.clearAllMocks());

describe("PlanCard", () => {
  it("renders the label and badge", () => {
    render(<PlanCard {...baseProps} />);
    expect(screen.getByText("Random name")).toBeInTheDocument();
    expect(screen.getByText("my-badge")).toBeInTheDocument();
  });

  it("fires onClick when pressed", async () => {
    render(<PlanCard {...baseProps} />);
    await userEvent.click(screen.getByRole("button"));
    expect(baseProps.onClick).toHaveBeenCalledTimes(1);
  });

  it("marks the card as selected", () => {
    const { container } = render(<PlanCard {...baseProps} selected />);
    expect(screen.getByRole("button").className).toContain("border-accent-2");
    expect(container.querySelector(".pcheck")?.className).toContain("checked");
  });

  it("marks the card as unselected", () => {
    const { container } = render(<PlanCard {...baseProps} selected={false} />);
    expect(screen.getByRole("button").className).toContain("border-foreground");
    expect(container.querySelector(".pcheck")?.className).not.toContain(
      "checked",
    );
  });
});
