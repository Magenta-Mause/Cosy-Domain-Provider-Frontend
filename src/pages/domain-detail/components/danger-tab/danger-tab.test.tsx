import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { DangerTab } from "./danger-tab";

describe("DangerTab", () => {
  it("renders the danger zone heading and delete action", () => {
    render(
      <DangerTab errorMessage={null} isDeleting={false} onDelete={vi.fn()} />,
    );
    expect(
      screen.getAllByText("domainDetail.dangerZone").length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByText("domainDetail.deleteDescription"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("domain-detail-delete-btn")).toHaveTextContent(
      "dashboard.delete",
    );
  });

  it("does not render an error message by default", () => {
    render(
      <DangerTab errorMessage={null} isDeleting={false} onDelete={vi.fn()} />,
    );
    expect(screen.queryByText(/nope/)).not.toBeInTheDocument();
  });

  it("renders the error message when provided", () => {
    render(
      <DangerTab errorMessage="nope" isDeleting={false} onDelete={vi.fn()} />,
    );
    expect(screen.getByText(/nope/)).toBeInTheDocument();
  });

  it("shows a deleting label and disables the button while deleting", () => {
    render(
      <DangerTab errorMessage={null} isDeleting={true} onDelete={vi.fn()} />,
    );
    const btn = screen.getByTestId("domain-detail-delete-btn");
    expect(btn).toHaveTextContent("dashboard.deleting");
    expect(btn).toBeDisabled();
  });

  it("calls onDelete when the button is clicked", async () => {
    const onDelete = vi.fn();
    render(
      <DangerTab errorMessage={null} isDeleting={false} onDelete={onDelete} />,
    );
    await userEvent.click(screen.getByTestId("domain-detail-delete-btn"));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
