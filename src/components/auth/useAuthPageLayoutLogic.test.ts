import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { mockLogoutUser, mockDeleteUser, mockRouterNavigate } = vi.hoisted(
  () => ({
    mockLogoutUser: vi.fn(),
    mockDeleteUser: vi.fn(),
    mockRouterNavigate: vi.fn(),
  }),
);

vi.mock("@/hooks/useAuthInformation/useAuthInformation", () => ({
  default: () => ({
    logoutUser: mockLogoutUser,
    deleteUser: mockDeleteUser,
    userName: "alice",
    isUserLoggedIn: true,
  }),
}));

vi.mock("@/router", () => ({
  router: { navigate: mockRouterNavigate },
}));

const mockT = (key: string) => key;
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: mockT }),
}));

import { useAuthPageLayoutLogic } from "./useAuthPageLayoutLogic";

beforeEach(() => {
  vi.clearAllMocks();
  mockRouterNavigate.mockResolvedValue(undefined);
  mockLogoutUser.mockResolvedValue(undefined);
  mockDeleteUser.mockResolvedValue(undefined);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useAuthPageLayoutLogic", () => {
  it("exposes userName and isUserLoggedIn from useAuthInformation", () => {
    const { result } = renderHook(() => useAuthPageLayoutLogic());
    expect(result.current.userName).toBe("alice");
    expect(result.current.isUserLoggedIn).toBe(true);
  });

  describe("handleLogout", () => {
    it("calls logoutUser and navigates to /login", async () => {
      const { result } = renderHook(() => useAuthPageLayoutLogic());

      await act(async () => {
        await result.current.handleLogout();
      });

      expect(mockLogoutUser).toHaveBeenCalledOnce();
      expect(mockRouterNavigate).toHaveBeenCalledWith({ to: "/login" });
    });

    it("clears isLoggingOut even when logoutUser throws", async () => {
      mockLogoutUser.mockRejectedValue(new Error("fail"));
      const { result } = renderHook(() => useAuthPageLayoutLogic());

      await act(async () => {
        await result.current.handleLogout().catch(() => {});
      });

      expect(result.current.isLoggingOut).toBe(false);
    });
  });

  describe("handleDelete", () => {
    it("deletes and navigates when confirmed", async () => {
      vi.stubGlobal("confirm", vi.fn().mockReturnValue(true));
      const { result } = renderHook(() => useAuthPageLayoutLogic());

      await act(async () => {
        await result.current.handleDelete();
      });

      expect(mockDeleteUser).toHaveBeenCalledOnce();
      expect(mockRouterNavigate).toHaveBeenCalledWith({ to: "/login" });
    });

    it("does nothing when confirm returns false", async () => {
      vi.stubGlobal("confirm", vi.fn().mockReturnValue(false));
      const { result } = renderHook(() => useAuthPageLayoutLogic());

      await act(async () => {
        await result.current.handleDelete();
      });

      expect(mockDeleteUser).not.toHaveBeenCalled();
      expect(mockRouterNavigate).not.toHaveBeenCalled();
    });
  });
});
