import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const defaultLogic = {
  authenticated: false,
  checking: false,
  username: "",
  setUsername: vi.fn(),
  password: "",
  setPassword: vi.fn(),
  error: false,
  submitting: false,
  login: vi.fn(),
};

let mockLogic = { ...defaultLogic };

vi.mock("./useStagingAuthProviderLogic", () => ({
  useStagingAuthProviderLogic: () => mockLogic,
}));

import { StagingAuthProvider } from "./staging-auth-provider";

beforeEach(() => {
  vi.clearAllMocks();
  mockLogic = { ...defaultLogic };
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("StagingAuthProvider", () => {
  it("renders children directly when staging auth is disabled", () => {
    render(
      <StagingAuthProvider>
        <div data-testid="content" />
      </StagingAuthProvider>,
    );
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("shows the login gate when staging auth is enabled", () => {
    vi.stubEnv("VITE_STAGING_AUTH_ENABLED", "true");
    render(
      <StagingAuthProvider>
        <div data-testid="content" />
      </StagingAuthProvider>,
    );
    expect(screen.queryByTestId("content")).not.toBeInTheDocument();
    expect(screen.getByLabelText("stagingAuth.username")).toBeInTheDocument();
  });

  it("shows a loading state while checking", () => {
    vi.stubEnv("VITE_STAGING_AUTH_ENABLED", "true");
    mockLogic = { ...defaultLogic, checking: true };
    render(
      <StagingAuthProvider>
        <div data-testid="content" />
      </StagingAuthProvider>,
    );
    expect(screen.queryByTestId("content")).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText("stagingAuth.username"),
    ).not.toBeInTheDocument();
  });

  it("renders children when authenticated", () => {
    vi.stubEnv("VITE_STAGING_AUTH_ENABLED", "true");
    mockLogic = { ...defaultLogic, authenticated: true };
    render(
      <StagingAuthProvider>
        <div data-testid="content" />
      </StagingAuthProvider>,
    );
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("submits the login form and shows errors", () => {
    vi.stubEnv("VITE_STAGING_AUTH_ENABLED", "true");
    mockLogic = { ...defaultLogic, error: true };
    const { container } = render(
      <StagingAuthProvider>
        <div />
      </StagingAuthProvider>,
    );
    expect(screen.getByText(/stagingAuth.error/)).toBeInTheDocument();
    const form = container.querySelector("form");
    expect(form).not.toBeNull();
    form?.dispatchEvent(new Event("submit", { bubbles: true }));
    expect(mockLogic.login).toHaveBeenCalled();
  });
});
