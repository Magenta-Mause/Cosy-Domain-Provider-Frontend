import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AdminUserDetail } from "../../lib";
import { useUserDetailLogic } from "./useUserDetailLogic";

vi.mock("../../lib", () => ({
  adminApi: {
    setMaxSubdomainOverride: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
  },
}));

const mockT = (key: string) => key;
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: mockT }),
}));

const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

import { adminApi } from "../../lib";

const mockOnSaved = vi.fn();

const baseDetail: AdminUserDetail = {
  uuid: "user-1",
  username: "alice",
  email: "alice@x.com",
  verified: true,
  tier: "FREE",
  maxSubdomainCount: 3,
  maxSubdomainCountOverride: null,
  planExpiresAt: null,
  createdAt: null,
  subdomains: [],
};

beforeEach(() => {
  vi.clearAllMocks();
  mockNavigate.mockResolvedValue(undefined);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useUserDetailLogic", () => {
  it("initialises fields from the detail object", () => {
    const { result } = renderHook(() =>
      useUserDetailLogic(baseDetail, "key", mockOnSaved),
    );
    expect(result.current.username).toBe("alice");
    expect(result.current.email).toBe("alice@x.com");
    expect(result.current.overrideInput).toBe("");
  });

  it("initialises overrideInput from maxSubdomainCountOverride when set", () => {
    const detail = { ...baseDetail, maxSubdomainCountOverride: 10 };
    const { result } = renderHook(() =>
      useUserDetailLogic(detail, "key", mockOnSaved),
    );
    expect(result.current.overrideInput).toBe("10");
  });

  describe("handleSaveOverride", () => {
    it("calls setMaxSubdomainOverride with null when input is empty", async () => {
      vi.mocked(adminApi.setMaxSubdomainOverride).mockResolvedValue(undefined);
      const { result } = renderHook(() =>
        useUserDetailLogic(baseDetail, "key", mockOnSaved),
      );

      await act(async () => {
        await result.current.handleSaveOverride();
      });

      expect(adminApi.setMaxSubdomainOverride).toHaveBeenCalledWith("key", "user-1", null);
      expect(mockOnSaved).toHaveBeenCalledOnce();
    });

    it("calls setMaxSubdomainOverride with the numeric value when input is set", async () => {
      vi.mocked(adminApi.setMaxSubdomainOverride).mockResolvedValue(undefined);
      const { result } = renderHook(() =>
        useUserDetailLogic(baseDetail, "key", mockOnSaved),
      );

      act(() => result.current.setOverrideInput("5"));

      await act(async () => {
        await result.current.handleSaveOverride();
      });

      expect(adminApi.setMaxSubdomainOverride).toHaveBeenCalledWith("key", "user-1", 5);
    });

    it("sets saveError on failure", async () => {
      vi.mocked(adminApi.setMaxSubdomainOverride).mockRejectedValue(new Error("fail"));
      const { result } = renderHook(() =>
        useUserDetailLogic(baseDetail, "key", mockOnSaved),
      );

      await act(async () => {
        await result.current.handleSaveOverride();
      });

      expect(result.current.saveError).toBe("admin.saveOverrideError");
      expect(result.current.isSaving).toBe(false);
    });
  });

  describe("handleSaveUser", () => {
    it("calls updateUser with only changed fields", async () => {
      vi.mocked(adminApi.updateUser).mockResolvedValue(baseDetail as never);
      const { result } = renderHook(() =>
        useUserDetailLogic(baseDetail, "key", mockOnSaved),
      );

      act(() => result.current.setUsername("alice2"));

      await act(async () => {
        await result.current.handleSaveUser();
      });

      expect(adminApi.updateUser).toHaveBeenCalledWith("key", "user-1", {
        username: "alice2",
      });
      expect(mockOnSaved).toHaveBeenCalledOnce();
    });

    it("sets saveUserError on failure", async () => {
      vi.mocked(adminApi.updateUser).mockRejectedValue(new Error("fail"));
      const { result } = renderHook(() =>
        useUserDetailLogic(baseDetail, "key", mockOnSaved),
      );

      act(() => result.current.setUsername("new"));

      await act(async () => {
        await result.current.handleSaveUser();
      });

      expect(result.current.saveUserError).toBe("admin.saveUserError");
      expect(result.current.isSavingUser).toBe(false);
    });
  });

  describe("handleDeleteUser", () => {
    it("does nothing when confirm is cancelled", async () => {
      vi.stubGlobal("confirm", vi.fn().mockReturnValue(false));
      const { result } = renderHook(() =>
        useUserDetailLogic(baseDetail, "key", mockOnSaved),
      );

      await act(async () => {
        await result.current.handleDeleteUser();
      });

      expect(adminApi.deleteUser).not.toHaveBeenCalled();
    });

    it("deletes and navigates to /admin on success", async () => {
      vi.stubGlobal("confirm", vi.fn().mockReturnValue(true));
      vi.mocked(adminApi.deleteUser).mockResolvedValue(undefined);
      const { result } = renderHook(() =>
        useUserDetailLogic(baseDetail, "key", mockOnSaved),
      );

      await act(async () => {
        await result.current.handleDeleteUser();
      });

      expect(adminApi.deleteUser).toHaveBeenCalledWith("key", "user-1");
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/admin" });
    });

    it("sets deleteError on failure", async () => {
      vi.stubGlobal("confirm", vi.fn().mockReturnValue(true));
      vi.mocked(adminApi.deleteUser).mockRejectedValue(new Error("fail"));
      const { result } = renderHook(() =>
        useUserDetailLogic(baseDetail, "key", mockOnSaved),
      );

      await act(async () => {
        await result.current.handleDeleteUser();
      });

      expect(result.current.deleteError).toBe("admin.deleteUserError");
      expect(result.current.isDeleting).toBe(false);
    });
  });

  it("handleBack navigates to /admin/users", () => {
    const { result } = renderHook(() =>
      useUserDetailLogic(baseDetail, "key", mockOnSaved),
    );
    act(() => result.current.handleBack());
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/admin/users" });
  });

  it("handleSubdomainClick navigates to the subdomain detail page", () => {
    const { result } = renderHook(() =>
      useUserDetailLogic(baseDetail, "key", mockOnSaved),
    );
    act(() => result.current.handleSubdomainClick("sub-xyz"));
    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/admin/subdomains/$subdomainId",
      params: { subdomainId: "sub-xyz" },
    });
  });
});
