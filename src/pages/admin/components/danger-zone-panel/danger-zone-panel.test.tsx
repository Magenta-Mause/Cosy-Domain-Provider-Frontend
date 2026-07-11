import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { DangerZonePanel } from "./danger-zone-panel";

describe("DangerZonePanel", () => {
  it("renders the danger zone heading and button label", () => {
    render(
      <DangerZonePanel
        buttonLabel="Delete subdomain"
        onDelete={vi.fn()}
        isDeleting={false}
        error={null}
      />,
    );
    expect(screen.getByText("admin.dangerZone")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Delete subdomain" }),
    ).toBeInTheDocument();
  });

  it("calls onDelete when the button is clicked", async () => {
    const onDelete = vi.fn();
    render(
      <DangerZonePanel
        buttonLabel="Delete"
        onDelete={onDelete}
        isDeleting={false}
        error={null}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("disables the button while deleting", () => {
    render(
      <DangerZonePanel
        buttonLabel="Delete"
        onDelete={vi.fn()}
        isDeleting={true}
        error={null}
      />,
    );
    expect(screen.getByRole("button", { name: "Delete" })).toBeDisabled();
  });

  it("shows the error message when present", () => {
    render(
      <DangerZonePanel
        buttonLabel="Delete"
        onDelete={vi.fn()}
        isDeleting={false}
        error="Something went wrong"
      />,
    );
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("does not render an error paragraph when error is null", () => {
    render(
      <DangerZonePanel
        buttonLabel="Delete"
        onDelete={vi.fn()}
        isDeleting={false}
        error={null}
      />,
    );
    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
  });
});
