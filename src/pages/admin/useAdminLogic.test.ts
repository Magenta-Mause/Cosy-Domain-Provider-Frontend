import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAdminLogic } from "./useAdminLogic";

const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("./lib", () => ({
  ADMIN_KEY_STORAGE: "admin_key",
}));

vi.mock("@/api/admin-api", () => ({
  adminApi: { getUsers: vi.fn() },
}));

import { adminApi } from "@/api/admin-api";

beforeEach(() => {
  vi.clearAllMocks();
  mockNavigate.mockResolvedValue(undefined);
  sessionStorage.clear();
});

const fakeSubmit = () =>
  ({ preventDefault: vi.fn() }) as unknown as React.SyntheticEvent;

function mockLogin(outcome: "ok" | "unauthorized") {
  if (outcome === "ok") {
    vi.mocked(adminApi.getUsers).mockResolvedValue([]);
  } else {
    vi.mocked(adminApi.getUsers).mockRejectedValue(new Error("UNAUTHORIZED"));
  }
}

describe("useAdminLogic", () => {
  it("starts unauthenticated with empty key and input", () => {
    const { result } = renderHook(() => useAdminLogic());
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.key).toBe("");
    expect(result.current.inputKey).toBe("");
    expect(result.current.loginError).toBe(false);
  });

  it("restores authenticated state from sessionStorage on mount", async () => {
    sessionStorage.setItem("admin_key", "stored-key");
    const { result } = renderHook(() => useAdminLogic());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.key).toBe("stored-key");
  });

  describe("login", () => {
    it("authenticates and stores key on a successful response", async () => {
      mockLogin("ok");
      const { result } = renderHook(() => useAdminLogic());

      await act(async () => {
        await result.current.login("secret-key");
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.key).toBe("secret-key");
      expect(result.current.loginError).toBe(false);
      expect(sessionStorage.getItem("admin_key")).toBe("secret-key");
    });

    it("sets loginError on a 401 response", async () => {
      mockLogin("unauthorized");
      const { result } = renderHook(() => useAdminLogic());

      await act(async () => {
        await result.current.login("wrong-key");
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.loginError).toBe(true);
    });

    it("sets loginError when the request throws", async () => {
      vi.mocked(adminApi.getUsers).mockRejectedValue(
        new Error("network error"),
      );
      const { result } = renderHook(() => useAdminLogic());

      await act(async () => {
        await result.current.login("key");
      });

      expect(result.current.loginError).toBe(true);
    });
  });

  describe("logout", () => {
    it("clears key, isAuthenticated, and sessionStorage", async () => {
      mockLogin("ok");
      const { result } = renderHook(() => useAdminLogic());

      await act(async () => {
        await result.current.login("secret-key");
      });

      act(() => result.current.logout());

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.key).toBe("");
      expect(sessionStorage.getItem("admin_key")).toBeNull();
    });
  });

  describe("handleLogin", () => {
    it("calls login with inputKey and navigates to /admin/subdomains", async () => {
      mockLogin("ok");
      const { result } = renderHook(() => useAdminLogic());

      act(() => result.current.setInputKey("my-key"));

      await act(async () => {
        await result.current.handleLogin(fakeSubmit());
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/admin/subdomains" });
    });

    it("clears isLogging after completion", async () => {
      mockLogin("ok");
      const { result } = renderHook(() => useAdminLogic());

      await act(async () => {
        await result.current.handleLogin(fakeSubmit());
      });

      expect(result.current.isLogging).toBe(false);
    });
  });
});
