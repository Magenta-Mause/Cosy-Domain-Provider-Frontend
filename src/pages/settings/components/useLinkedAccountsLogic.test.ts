import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockInitiateOAuthLink = vi.fn();
const mockUnlinkOAuth = vi.fn();
const mockLoadOAuthIdentities = vi.fn();

vi.mock("@/hooks/useDataInteractions/useDataInteractions", () => ({
  default: () => ({
    initiateOAuthLink: mockInitiateOAuthLink,
    unlinkOAuth: mockUnlinkOAuth,
  }),
}));

vi.mock("@/hooks/useDataLoading/useDataLoading", () => ({
  default: () => ({
    loadOAuthIdentities: mockLoadOAuthIdentities,
  }),
}));

const searchParams = { linked: false as boolean, linkError: false as boolean };

vi.mock("@tanstack/react-router", () => ({
  useSearch: () => searchParams,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { useLinkedAccountsLogic } from "./useLinkedAccountsLogic";

beforeEach(() => {
  vi.clearAllMocks();
  searchParams.linked = false;
  searchParams.linkError = false;
});

describe("useLinkedAccountsLogic", () => {
  it("starts in loading state and loads identities on mount", async () => {
    mockLoadOAuthIdentities.mockResolvedValue([
      { provider: "github", email: "a@a.com" },
    ]);

    const { result } = renderHook(() => useLinkedAccountsLogic());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.identities).toEqual([
      { provider: "github", email: "a@a.com" },
    ]);
  });

  it("stays unloaded with empty list when API fails", async () => {
    mockLoadOAuthIdentities.mockResolvedValue(null);

    const { result } = renderHook(() => useLinkedAccountsLogic());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.identities).toEqual([]);
  });

  it("isLinked returns true only for linked providers", async () => {
    mockLoadOAuthIdentities.mockResolvedValue([
      { provider: "github", email: "a@a.com" },
    ]);

    const { result } = renderHook(() => useLinkedAccountsLogic());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.isLinked("github")).toBe(true);
    expect(result.current.isLinked("google")).toBe(false);
    expect(result.current.isLinked("discord")).toBe(false);
  });

  it("handleLink delegates to initiateOAuthLink", async () => {
    mockLoadOAuthIdentities.mockResolvedValue([]);

    const { result } = renderHook(() => useLinkedAccountsLogic());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    act(() => {
      result.current.handleLink("discord");
    });

    expect(mockInitiateOAuthLink).toHaveBeenCalledWith("discord");
  });

  it("handleUnlink removes the identity on success", async () => {
    mockLoadOAuthIdentities.mockResolvedValue([
      { provider: "github", email: "a@a.com" },
      { provider: "google", email: "b@b.com" },
    ]);
    mockUnlinkOAuth.mockResolvedValue(undefined);

    const { result } = renderHook(() => useLinkedAccountsLogic());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    await act(async () => {
      await result.current.handleUnlink("github");
    });

    expect(result.current.identities).toEqual([
      { provider: "google", email: "b@b.com" },
    ]);
    expect(result.current.unlinkingProvider).toBeNull();
    expect(result.current.unlinkError).toBeNull();
  });

  it("handleUnlink sets unlinkError on failure", async () => {
    mockLoadOAuthIdentities.mockResolvedValue([
      { provider: "github", email: "a@a.com" },
    ]);
    mockUnlinkOAuth.mockRejectedValue(new Error("conflict"));

    const { result } = renderHook(() => useLinkedAccountsLogic());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    await act(async () => {
      await result.current.handleUnlink("github");
    });

    expect(result.current.unlinkError).toBe(
      "settings.linkedAccounts.unlinkError",
    );
    expect(result.current.unlinkingProvider).toBeNull();
    expect(result.current.identities).toHaveLength(1);
  });

  it("allProviders always contains all three", async () => {
    mockLoadOAuthIdentities.mockResolvedValue([]);

    const { result } = renderHook(() => useLinkedAccountsLogic());

    expect(result.current.allProviders).toEqual([
      "google",
      "github",
      "discord",
    ]);
  });

  it("justLinked reflects the linked search param", async () => {
    searchParams.linked = true;
    mockLoadOAuthIdentities.mockResolvedValue([]);

    const { result } = renderHook(() => useLinkedAccountsLogic());

    expect(result.current.justLinked).toBe(true);
    expect(result.current.justLinkFailed).toBe(false);
  });

  it("justLinkFailed reflects the linkError search param", async () => {
    searchParams.linkError = true;
    mockLoadOAuthIdentities.mockResolvedValue([]);

    const { result } = renderHook(() => useLinkedAccountsLogic());

    expect(result.current.justLinkFailed).toBe(true);
    expect(result.current.justLinked).toBe(false);
  });
});
