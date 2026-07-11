import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const defaultLogic = {
  newUsername: "",
  setNewUsername: vi.fn(),
  saving: false,
  success: false,
  error: null as string | null,
  canSubmit: true,
  handleSubmit: vi.fn((e: React.SyntheticEvent) => e.preventDefault()),
};

let mockLogic = { ...defaultLogic };

vi.mock("./useChangeUsernameFormLogic", () => ({
  useChangeUsernameFormLogic: () => mockLogic,
}));

import { ChangeUsernameForm } from "./change-username-form";

beforeEach(() => {
  vi.clearAllMocks();
  mockLogic = { ...defaultLogic };
});

describe("ChangeUsernameForm", () => {
  it("renders the username field with the current username as placeholder", () => {
    render(<ChangeUsernameForm currentUsername="alice" onSave={vi.fn()} />);
    const input = screen.getByTestId(
      "settings-new-username-input",
    ) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.placeholder).toBe("alice");
  });

  it("submits the form to the logic hook", () => {
    render(<ChangeUsernameForm currentUsername="alice" onSave={vi.fn()} />);
    const form = screen
      .getByTestId("settings-username-submit-btn")
      .closest("form");
    expect(form).not.toBeNull();
    fireEvent.submit(form as HTMLFormElement);
    expect(mockLogic.handleSubmit).toHaveBeenCalled();
  });

  it("shows the success banner", () => {
    mockLogic = { ...defaultLogic, success: true };
    render(<ChangeUsernameForm currentUsername="alice" onSave={vi.fn()} />);
    expect(screen.getByTestId("settings-username-success")).toBeInTheDocument();
    expect(screen.getByText("settings.usernameSuccess")).toBeInTheDocument();
  });

  it("renders an error message when present", () => {
    mockLogic = { ...defaultLogic, error: "settings.usernameError" };
    render(<ChangeUsernameForm currentUsername="alice" onSave={vi.fn()} />);
    expect(screen.getByText(/settings.usernameError/)).toBeInTheDocument();
  });

  it("disables the submit button while saving and shows saving label", () => {
    mockLogic = { ...defaultLogic, saving: true };
    render(<ChangeUsernameForm currentUsername="alice" onSave={vi.fn()} />);
    const btn = screen.getByTestId(
      "settings-username-submit-btn",
    ) as HTMLButtonElement;
    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent("settings.saving");
  });

  it("disables the submit button when submission is not allowed", () => {
    mockLogic = { ...defaultLogic, canSubmit: false };
    render(<ChangeUsernameForm currentUsername="alice" onSave={vi.fn()} />);
    expect(screen.getByTestId("settings-username-submit-btn")).toBeDisabled();
  });
});
