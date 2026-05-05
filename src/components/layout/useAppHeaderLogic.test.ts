import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAppHeaderLogic } from "./useAppHeaderLogic";

vi.mock("@/hooks/useAuthInformation/useAuthInformation", () => ({
  default: vi.fn(),
}));

vi.mock("@/router", () => ({
  router: { navigate: vi.fn() },
}));

import useAuthInformation from "@/hooks/useAuthInformation/useAuthInformation";
import { router } from "@/router";

const mockLogout = vi.fn();
const mockDelete = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useAuthInformation).mockReturnValue({
    logoutUser: mockLogout,
    deleteUser: mockDelete,
    userName: "alice",
    isUserLoggedIn: true,
    userTier: "FREE",
  } as ReturnType<typeof useAuthInformation>);
  vi.mocked(router.navigate).mockResolvedValue(undefined);
});

describe("useAppHeaderLogic", () => {
  it("exposes userName, isUserLoggedIn, and userTier from auth", () => {
    const { result } = renderHook(() => useAppHeaderLogic());
    expect(result.current.userName).toBe("alice");
    expect(result.current.isUserLoggedIn).toBe(true);
    expect(result.current.userTier).toBe("FREE");
  });

  it("starts with all loading/modal flags false", () => {
    const { result } = renderHook(() => useAppHeaderLogic());
    expect(result.current.isLoggingOut).toBe(false);
    expect(result.current.isDeleting).toBe(false);
    expect(result.current.showDeleteModal).toBe(false);
  });

  describe("handleLogout", () => {
    it("calls logoutUser and navigates to /login", async () => {
      mockLogout.mockResolvedValue(undefined);
      const { result } = renderHook(() => useAppHeaderLogic());

      await act(async () => {
        await result.current.handleLogout();
      });

      expect(mockLogout).toHaveBeenCalledOnce();
      expect(router.navigate).toHaveBeenCalledWith({ to: "/login" });
    });

    it("clears isLoggingOut after logoutUser resolves", async () => {
      mockLogout.mockResolvedValue(undefined);
      const { result } = renderHook(() => useAppHeaderLogic());

      await act(async () => {
        await result.current.handleLogout();
      });

      expect(result.current.isLoggingOut).toBe(false);
    });

    it("clears isLoggingOut even when logoutUser throws", async () => {
      mockLogout.mockRejectedValue(new Error("network error"));
      const { result } = renderHook(() => useAppHeaderLogic());

      await act(async () => {
        await result.current.handleLogout().catch(() => {});
      });

      expect(result.current.isLoggingOut).toBe(false);
    });
  });

  describe("handleDelete / handleConfirmDelete / handleCancelDelete", () => {
    it("handleDelete opens the confirmation modal", async () => {
      const { result } = renderHook(() => useAppHeaderLogic());

      await act(async () => {
        await result.current.handleDelete();
      });

      expect(result.current.showDeleteModal).toBe(true);
    });

    it("handleCancelDelete closes the modal", async () => {
      const { result } = renderHook(() => useAppHeaderLogic());

      await act(async () => {
        await result.current.handleDelete();
      });
      act(() => {
        result.current.handleCancelDelete();
      });

      expect(result.current.showDeleteModal).toBe(false);
    });

    it("handleConfirmDelete calls deleteUser, closes modal, and navigates to /login", async () => {
      mockDelete.mockResolvedValue(undefined);
      const { result } = renderHook(() => useAppHeaderLogic());

      await act(async () => {
        await result.current.handleDelete();
      });
      await act(async () => {
        await result.current.handleConfirmDelete();
      });

      expect(mockDelete).toHaveBeenCalledOnce();
      expect(result.current.showDeleteModal).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith({ to: "/login" });
    });

    it("clears isDeleting after handleConfirmDelete even on error", async () => {
      mockDelete.mockRejectedValue(new Error("oops"));
      const { result } = renderHook(() => useAppHeaderLogic());

      await act(async () => {
        await result.current.handleConfirmDelete().catch(() => {});
      });

      expect(result.current.isDeleting).toBe(false);
    });
  });
});
