import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const defaultLogic = {
  domainCreationEnabled: true,
  isLoading: false,
  isToggling: false,
  toggle: vi.fn(),
};

let mockLogic = { ...defaultLogic };

vi.mock("./useKillSwitchLogic", () => ({
  useKillSwitchLogic: () => mockLogic,
}));

import { KillSwitchPanel } from "./kill-switch-panel";

beforeEach(() => {
  vi.clearAllMocks();
  mockLogic = { ...defaultLogic };
});

describe("KillSwitchPanel", () => {
  it("renders title, description and the enabled state with disable action", () => {
    render(<KillSwitchPanel adminKey="k" />);
    expect(screen.getByText("admin.killSwitchTitle")).toBeInTheDocument();
    expect(screen.getByText("admin.killSwitchDescription")).toBeInTheDocument();
    expect(screen.getByText("admin.killSwitchEnabled")).toBeInTheDocument();
    expect(screen.getByText("admin.killSwitchDisable")).toBeInTheDocument();
  });

  it("renders nothing while loading", () => {
    mockLogic = { ...defaultLogic, isLoading: true };
    const { container } = render(<KillSwitchPanel adminKey="k" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the disabled state and enable action when creation is off", () => {
    mockLogic = { ...defaultLogic, domainCreationEnabled: false };
    render(<KillSwitchPanel adminKey="k" />);
    expect(screen.getByText("admin.killSwitchDisabled")).toBeInTheDocument();
    expect(screen.getByText("admin.killSwitchEnable")).toBeInTheDocument();
  });

  it("shows the toggling label and disables the button while toggling", () => {
    mockLogic = { ...defaultLogic, isToggling: true };
    render(<KillSwitchPanel adminKey="k" />);
    expect(screen.getByText("admin.killSwitchToggling")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("invokes toggle when the button is clicked", async () => {
    render(<KillSwitchPanel adminKey="k" />);
    await userEvent.click(screen.getByRole("button"));
    expect(mockLogic.toggle).toHaveBeenCalledTimes(1);
  });
});
