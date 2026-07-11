import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockInitiateOAuth = vi.fn();

vi.mock("@/hooks/useDataInteractions/useDataInteractions", () => ({
  default: () => ({ initiateOAuth: mockInitiateOAuth }),
}));

import { OAuthButtons } from "./oauth-buttons";

beforeEach(() => vi.clearAllMocks());

describe("OAuthButtons", () => {
  it("starts the OAuth flow for each provider", async () => {
    render(<OAuthButtons variant="login" />);

    await userEvent.click(screen.getByTestId("login-oauth-google-btn"));
    expect(mockInitiateOAuth).toHaveBeenCalledWith("google");

    await userEvent.click(screen.getByTestId("login-oauth-github-btn"));
    expect(mockInitiateOAuth).toHaveBeenCalledWith("github");

    await userEvent.click(screen.getByTestId("login-oauth-discord-btn"));
    expect(mockInitiateOAuth).toHaveBeenCalledWith("discord");
  });

  it("uses the variant in the test ids", () => {
    render(<OAuthButtons variant="register" />);
    expect(screen.getByTestId("register-oauth-google-btn")).toBeInTheDocument();
  });
});
