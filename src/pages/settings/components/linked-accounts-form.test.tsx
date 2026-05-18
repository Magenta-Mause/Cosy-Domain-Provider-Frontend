import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const mockHandleLink = vi.fn();
const mockHandleUnlink = vi.fn();

const defaultLogic = {
  allProviders: ["google", "github", "discord"] as const,
  identities: [],
  loading: false,
  isLinked: (_p: string) => false,
  handleLink: mockHandleLink,
  handleUnlink: mockHandleUnlink,
  unlinkingProvider: null as string | null,
  unlinkError: null as string | null,
  justLinked: false,
  justLinkFailed: false,
};

let mockLogicReturn = { ...defaultLogic };

vi.mock("./useLinkedAccountsLogic", () => ({
  useLinkedAccountsLogic: () => mockLogicReturn,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/components/ui/brand-icons", () => ({
  GoogleIcon: () => <span>Google</span>,
  GitHubIcon: () => <span>GitHub</span>,
  DiscordIcon: () => <span>Discord</span>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    ...rest
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: string;
    size?: string;
  }) => (
    <button onClick={onClick} disabled={disabled} {...rest}>
      {children}
    </button>
  ),
}));

vi.mock("@/components/pixel/error-message", () => ({
  ErrorMessage: ({
    children,
    ...rest
  }: React.HTMLAttributes<HTMLSpanElement>) => (
    <span role="alert" {...rest}>
      {children}
    </span>
  ),
}));

import { LinkedAccountsForm } from "./linked-accounts-form";

beforeEach(() => {
  vi.clearAllMocks();
  mockLogicReturn = { ...defaultLogic, isLinked: (_p: string) => false };
});

describe("LinkedAccountsForm", () => {
  it("shows loading text while loading", () => {
    mockLogicReturn = { ...defaultLogic, loading: true };
    render(<LinkedAccountsForm />);
    expect(
      screen.getByText("settings.linkedAccounts.loading"),
    ).toBeInTheDocument();
  });

  it("renders link buttons for unlinked providers", () => {
    render(<LinkedAccountsForm />);
    expect(
      screen.getByTestId("settings-link-google-btn"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("settings-link-github-btn"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("settings-link-discord-btn"),
    ).toBeInTheDocument();
  });

  it("renders unlink button for linked provider", () => {
    mockLogicReturn = {
      ...defaultLogic,
      isLinked: (p: string) => p === "github",
    };
    render(<LinkedAccountsForm />);
    expect(
      screen.getByTestId("settings-unlink-github-btn"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("settings-link-google-btn"),
    ).toBeInTheDocument();
  });

  it("calls handleLink when link button is clicked", async () => {
    render(<LinkedAccountsForm />);
    await userEvent.click(screen.getByTestId("settings-link-google-btn"));
    expect(mockHandleLink).toHaveBeenCalledWith("google");
  });

  it("calls handleUnlink when unlink button is clicked", async () => {
    mockLogicReturn = {
      ...defaultLogic,
      isLinked: (p: string) => p === "github",
    };
    render(<LinkedAccountsForm />);
    await userEvent.click(screen.getByTestId("settings-unlink-github-btn"));
    expect(mockHandleUnlink).toHaveBeenCalledWith("github");
  });

  it("disables unlink button while unlinking", () => {
    mockLogicReturn = {
      ...defaultLogic,
      isLinked: (p: string) => p === "github",
      unlinkingProvider: "github",
    };
    render(<LinkedAccountsForm />);
    expect(screen.getByTestId("settings-unlink-github-btn")).toBeDisabled();
  });

  it("shows success banner when justLinked", () => {
    mockLogicReturn = { ...defaultLogic, justLinked: true };
    render(<LinkedAccountsForm />);
    expect(
      screen.getByTestId("settings-link-success"),
    ).toBeInTheDocument();
  });

  it("shows error banner when justLinkFailed", () => {
    mockLogicReturn = { ...defaultLogic, justLinkFailed: true };
    render(<LinkedAccountsForm />);
    expect(
      screen.getByTestId("settings-link-error"),
    ).toBeInTheDocument();
  });

  it("shows unlinkError when present", () => {
    mockLogicReturn = {
      ...defaultLogic,
      unlinkError: "settings.linkedAccounts.unlinkError",
    };
    render(<LinkedAccountsForm />);
    expect(
      screen.getByText("settings.linkedAccounts.unlinkError"),
    ).toBeInTheDocument();
  });
});
