import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AuthState } from "@/store/auth-slice";
import { makeWrapper } from "@/test/store-utils";
import useAuthInformation from "./useAuthInformation";

vi.mock("@/hooks/useDataInteractions/useDataInteractions", () => ({
  default: vi.fn(),
}));

import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";

const mockLogout = vi.fn();
const mockRefresh = vi.fn();
const mockUpdateUser = vi.fn();
const mockDeleteUserInteraction = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useDataInteractions).mockReturnValue({
    logoutUser: mockLogout,
    refreshIdentityToken: mockRefresh,
    updateUser: mockUpdateUser,
    deleteUser: mockDeleteUserInteraction,
  } as ReturnType<typeof useDataInteractions>);
});

const loggedInAuth: Partial<AuthState> = {
  identityToken: "tok123",
  bootstrapped: true,
  state: "idle",
  user: {
    username: "alice",
    email: "alice@example.com",
    subject: "sub-1",
    isVerified: true,
    needsPasswordSetup: false,
    isMfaEnabled: true,
    tier: "PLUS",
    maxSubdomainCount: 5,
    issuedAt: 1700000000,
    expiresAt: 1700003600,
    claims: { role: "admin" },
  },
};

describe("useAuthInformation", () => {
  describe("derived auth state values", () => {
    it("reports isUserLoggedIn true when a token is present", () => {
      const { result } = renderHook(() => useAuthInformation(), {
        wrapper: makeWrapper({ auth: loggedInAuth as AuthState }),
      });
      expect(result.current.isUserLoggedIn).toBe(true);
    });

    it("reports isUserLoggedIn false when no token", () => {
      const { result } = renderHook(() => useAuthInformation(), {
        wrapper: makeWrapper(),
      });
      expect(result.current.isUserLoggedIn).toBe(false);
    });

    it("exposes all user fields from the store", () => {
      const { result } = renderHook(() => useAuthInformation(), {
        wrapper: makeWrapper({ auth: loggedInAuth as AuthState }),
      });
      expect(result.current.userName).toBe("alice");
      expect(result.current.userEmail).toBe("alice@example.com");
      expect(result.current.userSubject).toBe("sub-1");
      expect(result.current.isVerified).toBe(true);
      expect(result.current.needsPasswordSetup).toBe(false);
      expect(result.current.isMfaEnabled).toBe(true);
      expect(result.current.userTier).toBe("PLUS");
      expect(result.current.maxSubdomainCount).toBe(5);
      expect(result.current.tokenIssuedAt).toBe(1700000000);
      expect(result.current.tokenExpiresAt).toBe(1700003600);
      expect(result.current.userClaims).toEqual({ role: "admin" });
    });

    it("returns safe defaults when user is null", () => {
      const { result } = renderHook(() => useAuthInformation(), {
        wrapper: makeWrapper(),
      });
      expect(result.current.userName).toBeNull();
      expect(result.current.userEmail).toBeNull();
      expect(result.current.needsPasswordSetup).toBe(false);
      expect(result.current.isMfaEnabled).toBe(false);
      expect(result.current.userTier).toBeNull();
      expect(result.current.maxSubdomainCount).toBeNull();
      expect(result.current.userClaims).toEqual({});
    });

    it("exposes bootstrapped and authState from the store", () => {
      const { result } = renderHook(() => useAuthInformation(), {
        wrapper: makeWrapper({ auth: loggedInAuth as AuthState }),
      });
      expect(result.current.isBootstrapped).toBe(true);
      expect(result.current.authState).toBe("idle");
    });
  });

  describe("deleteUser", () => {
    it("calls deleteUserInteraction and then logoutUser", async () => {
      mockDeleteUserInteraction.mockResolvedValue(undefined);
      mockLogout.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuthInformation(), {
        wrapper: makeWrapper({ auth: loggedInAuth as AuthState }),
      });

      await result.current.deleteUser();

      expect(mockDeleteUserInteraction).toHaveBeenCalledOnce();
      expect(mockLogout).toHaveBeenCalledOnce();
    });

    it("swallows logoutUser errors after a successful delete", async () => {
      mockDeleteUserInteraction.mockResolvedValue(undefined);
      mockLogout.mockRejectedValue(new Error("session gone"));

      const { result } = renderHook(() => useAuthInformation(), {
        wrapper: makeWrapper({ auth: loggedInAuth as AuthState }),
      });

      await expect(result.current.deleteUser()).resolves.toBeUndefined();
    });
  });
});
