import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeWrapper } from "@/test/store-utils";

vi.mock("@/hooks/useDataLoading/useDataLoading", () => ({
  default: () => ({ loadSubdomains: mockLoadSubdomains }),
}));

vi.mock("@/api/generated/domain-provider-api", () => ({
  fetchToken: vi.fn(),
  logout: vi.fn(),
  createSubdomain: vi.fn(),
  deleteSubdomain: vi.fn(),
  updateSubdomain: vi.fn(),
  verifyEmail: vi.fn(),
  resendVerification: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
  deleteUser: vi.fn(),
  updateUser: vi.fn(),
}));

vi.mock("@/api/axios-instance", () => ({
  customInstance: vi.fn(),
  setIdentityToken: vi.fn(),
}));

vi.mock("@/api/billing-api", () => ({
  getBillingPortalUrl: vi.fn(),
  getCheckoutUrl: vi.fn(),
}));

vi.mock("@/lib/jwt", () => ({
  parseIdentityToken: vi.fn(),
}));

const mockLoadSubdomains = vi.fn();

import {
  fetchToken,
  logout,
  createSubdomain,
  deleteSubdomain,
  updateSubdomain,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  deleteUser,
  updateUser,
} from "@/api/generated/domain-provider-api";
import { customInstance, setIdentityToken } from "@/api/axios-instance";
import { getBillingPortalUrl, getCheckoutUrl } from "@/api/billing-api";
import { parseIdentityToken } from "@/lib/jwt";
import useDataInteractions from "./useDataInteractions";

beforeEach(() => {
  vi.clearAllMocks();
  mockLoadSubdomains.mockResolvedValue([]);
});

describe("useDataInteractions", () => {
  describe("refreshIdentityToken", () => {
    it("sets token and loads subdomains", async () => {
      vi.mocked(fetchToken).mockResolvedValue("tok");
      vi.mocked(parseIdentityToken).mockReturnValue({ sub: "u1" } as never);

      const { result } = renderHook(() => useDataInteractions(), {
        wrapper: makeWrapper(),
      });

      await act(async () => {
        await result.current.refreshIdentityToken();
      });

      expect(setIdentityToken).toHaveBeenCalledWith("tok");
      expect(mockLoadSubdomains).toHaveBeenCalledOnce();
    });

    it("clears identity and throws on failure", async () => {
      vi.mocked(fetchToken).mockRejectedValue(new Error("401"));

      const { result } = renderHook(() => useDataInteractions(), {
        wrapper: makeWrapper(),
      });

      await act(async () => {
        await expect(result.current.refreshIdentityToken()).rejects.toThrow(
          "Unable to refresh identity token",
        );
      });

      expect(setIdentityToken).toHaveBeenCalledWith(null);
    });
  });

  describe("loginUser", () => {
    it("returns parsed token on normal login", async () => {
      vi.mocked(customInstance).mockResolvedValue({});
      vi.mocked(fetchToken).mockResolvedValue("tok");
      vi.mocked(parseIdentityToken).mockReturnValue({ sub: "u1" } as never);

      const { result } = renderHook(() => useDataInteractions(), {
        wrapper: makeWrapper(),
      });

      let returned: unknown;
      await act(async () => {
        returned = await result.current.loginUser({
          email: "a@b.com",
          password: "pw",
          captchaToken: "ct",
        });
      });

      expect(returned).toEqual({ sub: "u1" });
    });

    it("returns mfaRequired when server signals MFA", async () => {
      vi.mocked(customInstance).mockResolvedValue({
        mfaRequired: true,
        challengeToken: "ch-tok",
      });

      const { result } = renderHook(() => useDataInteractions(), {
        wrapper: makeWrapper(),
      });

      let returned: unknown;
      await act(async () => {
        returned = await result.current.loginUser({
          email: "a@b.com",
          password: "pw",
          captchaToken: "ct",
        });
      });

      expect(returned).toEqual({ mfaRequired: true, challengeToken: "ch-tok" });
    });

    it("throws on failure", async () => {
      vi.mocked(customInstance).mockRejectedValue(new Error("401"));

      const { result } = renderHook(() => useDataInteractions(), {
        wrapper: makeWrapper(),
      });

      await act(async () => {
        await expect(
          result.current.loginUser({ email: "a@b.com", password: "pw", captchaToken: "ct" }),
        ).rejects.toThrow();
      });
    });
  });

  describe("registerUser", () => {
    it("calls customInstance then refreshes token", async () => {
      vi.mocked(customInstance).mockResolvedValue({});
      vi.mocked(fetchToken).mockResolvedValue("tok");
      vi.mocked(parseIdentityToken).mockReturnValue({ sub: "u1" } as never);

      const { result } = renderHook(() => useDataInteractions(), {
        wrapper: makeWrapper(),
      });

      await act(async () => {
        await result.current.registerUser({
          username: "alice",
          email: "a@b.com",
          password: "pw",
          captchaToken: "ct",
        });
      });

      expect(customInstance).toHaveBeenCalledOnce();
      expect(fetchToken).toHaveBeenCalledOnce();
    });
  });

  describe("logoutUser", () => {
    it("calls logout and clears identity", async () => {
      vi.mocked(logout).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDataInteractions(), {
        wrapper: makeWrapper(),
      });

      await act(async () => {
        await result.current.logoutUser();
      });

      expect(logout).toHaveBeenCalledOnce();
      expect(setIdentityToken).toHaveBeenCalledWith(null);
    });

    it("still clears identity even when logout throws", async () => {
      vi.mocked(logout).mockRejectedValue(new Error("network"));

      const { result } = renderHook(() => useDataInteractions(), {
        wrapper: makeWrapper(),
      });

      await act(async () => {
        await result.current.logoutUser().catch(() => {});
      });

      expect(setIdentityToken).toHaveBeenCalledWith(null);
    });
  });

  describe("createSubdomain", () => {
    it("calls createSubdomain and returns created", async () => {
      const created = { uuid: "s1", label: "test" };
      vi.mocked(createSubdomain).mockResolvedValue(created as never);

      const { result } = renderHook(() => useDataInteractions(), {
        wrapper: makeWrapper(),
      });

      let returned: unknown;
      await act(async () => {
        returned = await result.current.createSubdomain({
          label: "test",
          targetIp: "1.2.3.4",
        });
      });

      expect(createSubdomain).toHaveBeenCalledWith({ label: "test", targetIp: "1.2.3.4" });
      expect(returned).toEqual(created);
    });
  });

  describe("updateSubdomain", () => {
    it("calls updateSubdomain and dispatches upsert", async () => {
      const updated = { uuid: "s1", targetIp: "5.6.7.8" };
      vi.mocked(updateSubdomain).mockResolvedValue(updated as never);

      const { result } = renderHook(() => useDataInteractions(), {
        wrapper: makeWrapper(),
      });

      let returned: unknown;
      await act(async () => {
        returned = await result.current.updateSubdomain("s1", { targetIp: "5.6.7.8" });
      });

      expect(updateSubdomain).toHaveBeenCalledWith("s1", { targetIp: "5.6.7.8" });
      expect(returned).toEqual(updated);
    });

    it("throws on failure", async () => {
      vi.mocked(updateSubdomain).mockRejectedValue(new Error("fail"));

      const { result } = renderHook(() => useDataInteractions(), {
        wrapper: makeWrapper(),
      });

      await act(async () => {
        await expect(
          result.current.updateSubdomain("s1", { targetIp: "bad" }),
        ).rejects.toThrow();
      });
    });
  });

  describe("deleteSubdomain", () => {
    it("calls deleteSubdomain and dispatches remove", async () => {
      vi.mocked(deleteSubdomain).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDataInteractions(), {
        wrapper: makeWrapper(),
      });

      await act(async () => {
        await result.current.deleteSubdomain("s1");
      });

      expect(deleteSubdomain).toHaveBeenCalledWith("s1");
    });

    it("throws on failure", async () => {
      vi.mocked(deleteSubdomain).mockRejectedValue(new Error("fail"));

      const { result } = renderHook(() => useDataInteractions(), {
        wrapper: makeWrapper(),
      });

      await act(async () => {
        await expect(result.current.deleteSubdomain("s1")).rejects.toThrow();
      });
    });
  });

  describe("verifyAccount", () => {
    it("verifies email and refreshes token", async () => {
      vi.mocked(verifyEmail).mockResolvedValue(undefined);
      vi.mocked(fetchToken).mockResolvedValue("tok");
      vi.mocked(parseIdentityToken).mockReturnValue({ sub: "u1" } as never);

      const { result } = renderHook(() => useDataInteractions(), {
        wrapper: makeWrapper(),
      });

      await act(async () => {
        await result.current.verifyAccount("123456");
      });

      expect(verifyEmail).toHaveBeenCalledWith({ token: "123456" });
    });

    it("throws Verification Failed on failure", async () => {
      vi.mocked(verifyEmail).mockRejectedValue(new Error("bad code"));

      const { result } = renderHook(() => useDataInteractions(), {
        wrapper: makeWrapper(),
      });

      await act(async () => {
        await expect(result.current.verifyAccount("bad")).rejects.toThrow(
          "Verification Failed",
        );
      });
    });
  });

  it("resendVerificationCode calls resendVerification", async () => {
    vi.mocked(resendVerification).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDataInteractions(), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      await result.current.resendVerificationCode();
    });

    expect(resendVerification).toHaveBeenCalledOnce();
  });

  it("requestPasswordReset calls forgotPassword", async () => {
    vi.mocked(forgotPassword).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDataInteractions(), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      await result.current.requestPasswordReset("a@b.com");
    });

    expect(forgotPassword).toHaveBeenCalledWith({ email: "a@b.com" });
  });

  it("confirmPasswordReset calls resetPassword", async () => {
    vi.mocked(resetPassword).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDataInteractions(), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      await result.current.confirmPasswordReset("token", "newpw");
    });

    expect(resetPassword).toHaveBeenCalledWith({ token: "token", newPassword: "newpw" });
  });

  it("updateUser calls updateUser and refreshes token", async () => {
    vi.mocked(updateUser).mockResolvedValue(undefined);
    vi.mocked(fetchToken).mockResolvedValue("tok");
    vi.mocked(parseIdentityToken).mockReturnValue({ sub: "u1" } as never);

    const { result } = renderHook(() => useDataInteractions(), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      await result.current.updateUser({ username: "alice2" });
    });

    expect(updateUser).toHaveBeenCalledWith({ username: "alice2" });
    expect(fetchToken).toHaveBeenCalledOnce();
  });

  it("deleteUser calls deleteUser", async () => {
    vi.mocked(deleteUser).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDataInteractions(), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      await result.current.deleteUser();
    });

    expect(deleteUser).toHaveBeenCalledOnce();
  });

  describe("setupMfa", () => {
    it("calls customInstance for MFA setup", async () => {
      const mfaData = { totpUri: "otpauth://...", secret: "abc" };
      vi.mocked(customInstance).mockResolvedValue(mfaData);

      const { result } = renderHook(() => useDataInteractions(), {
        wrapper: makeWrapper(),
      });

      let returned: unknown;
      await act(async () => {
        returned = await result.current.setupMfa();
      });

      expect(customInstance).toHaveBeenCalledWith({
        method: "POST",
        url: "/api/v1/auth/mfa/setup",
      });
      expect(returned).toEqual(mfaData);
    });
  });

  describe("confirmMfa", () => {
    it("confirms MFA and refreshes token", async () => {
      vi.mocked(customInstance).mockResolvedValue({});
      vi.mocked(fetchToken).mockResolvedValue("tok");
      vi.mocked(parseIdentityToken).mockReturnValue({ sub: "u1" } as never);

      const { result } = renderHook(() => useDataInteractions(), {
        wrapper: makeWrapper(),
      });

      await act(async () => {
        await result.current.confirmMfa("123456");
      });

      expect(customInstance).toHaveBeenCalledWith({
        method: "POST",
        url: "/api/v1/auth/mfa/confirm",
        data: { totpCode: "123456" },
      });
      expect(fetchToken).toHaveBeenCalledOnce();
    });
  });

  describe("completeMfaChallenge", () => {
    it("completes challenge and returns parsed token", async () => {
      vi.mocked(customInstance).mockResolvedValue({});
      vi.mocked(fetchToken).mockResolvedValue("tok");
      vi.mocked(parseIdentityToken).mockReturnValue({ sub: "u1" } as never);

      const { result } = renderHook(() => useDataInteractions(), {
        wrapper: makeWrapper(),
      });

      let returned: unknown;
      await act(async () => {
        returned = await result.current.completeMfaChallenge("ch-tok", "654321");
      });

      expect(customInstance).toHaveBeenCalledWith({
        method: "POST",
        url: "/api/v1/auth/mfa/challenge",
        data: { challengeToken: "ch-tok", totpCode: "654321" },
      });
      expect(returned).toEqual({ sub: "u1" });
    });
  });

  describe("openBillingPortal", () => {
    it("navigates to billing portal URL", async () => {
      vi.mocked(getBillingPortalUrl).mockResolvedValue({ url: "https://billing.example.com" });
      vi.stubGlobal("location", { href: "" });

      const { result } = renderHook(() => useDataInteractions(), {
        wrapper: makeWrapper(),
      });

      await act(async () => {
        await result.current.openBillingPortal();
      });

      expect(globalThis.location.href).toBe("https://billing.example.com");
      vi.unstubAllGlobals();
    });
  });

  describe("openCheckout", () => {
    it("navigates to checkout URL", async () => {
      vi.mocked(getCheckoutUrl).mockResolvedValue({ url: "https://checkout.example.com" });
      vi.stubGlobal("location", { href: "" });

      const { result } = renderHook(() => useDataInteractions(), {
        wrapper: makeWrapper(),
      });

      await act(async () => {
        await result.current.openCheckout();
      });

      expect(globalThis.location.href).toBe("https://checkout.example.com");
      vi.unstubAllGlobals();
    });
  });
});
