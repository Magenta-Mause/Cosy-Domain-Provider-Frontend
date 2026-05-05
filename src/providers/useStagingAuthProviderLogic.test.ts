import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockGet, mockPost } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
}));

vi.mock("axios", () => ({
  default: {
    create: () => ({
      get: mockGet,
      post: mockPost,
    }),
  },
}));

import { useStagingAuthProviderLogic } from "./useStagingAuthProviderLogic";

beforeEach(() => vi.clearAllMocks());

describe("useStagingAuthProviderLogic", () => {
  it("starts checking and sets authenticated=true when GET succeeds", async () => {
    mockGet.mockResolvedValue({});

    const { result } = renderHook(() => useStagingAuthProviderLogic());

    expect(result.current.checking).toBe(true);

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.authenticated).toBe(true);
    expect(result.current.checking).toBe(false);
  });

  it("sets authenticated=false when GET fails", async () => {
    mockGet.mockRejectedValue(new Error("401"));

    const { result } = renderHook(() => useStagingAuthProviderLogic());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.authenticated).toBe(false);
    expect(result.current.checking).toBe(false);
  });

  describe("login", () => {
    it("sets authenticated=true on successful login", async () => {
      mockGet.mockRejectedValue(new Error("401"));
      mockPost.mockResolvedValue({});

      const { result } = renderHook(() => useStagingAuthProviderLogic());

      await act(async () => {
        await new Promise((r) => setTimeout(r, 0));
      });

      act(() => {
        result.current.setUsername("admin");
        result.current.setPassword("secret");
      });

      await act(async () => {
        await result.current.login();
      });

      expect(mockPost).toHaveBeenCalledOnce();
      expect(result.current.authenticated).toBe(true);
      expect(result.current.submitting).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it("sets error on failed login", async () => {
      mockGet.mockRejectedValue(new Error("401"));
      mockPost.mockRejectedValue(new Error("wrong password"));

      const { result } = renderHook(() => useStagingAuthProviderLogic());

      await act(async () => {
        await new Promise((r) => setTimeout(r, 0));
      });

      await act(async () => {
        await result.current.login();
      });

      expect(result.current.error).toBe("error");
      expect(result.current.submitting).toBe(false);
      expect(result.current.authenticated).toBe(false);
    });
  });
});
