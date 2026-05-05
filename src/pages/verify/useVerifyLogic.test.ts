import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useVerifyLogic } from "./useVerifyLogic";

vi.mock("@/hooks/useDataInteractions/useDataInteractions", () => ({
  default: vi.fn(),
}));

vi.mock("@/hooks/useAuthInformation/useAuthInformation", () => ({
  default: vi.fn(),
}));

const mockT = (key: string) => key;
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: mockT }),
}));

vi.mock("@/routes/verify", () => ({
  Route: { useSearch: vi.fn() },
}));

import useAuthInformation from "@/hooks/useAuthInformation/useAuthInformation";
import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";
import { Route } from "@/routes/verify";

const mockVerifyAccount = vi.fn();
const mockResendCode = vi.fn();
const mockSetupPassword = vi.fn();

function mockAuth(overrides: Partial<ReturnType<typeof useAuthInformation>> = {}) {
  vi.mocked(useAuthInformation).mockReturnValue({
    userEmail: "user@example.com",
    isVerified: false,
    needsPasswordSetup: false,
    isUserLoggedIn: true,
    ...overrides,
  } as ReturnType<typeof useAuthInformation>);
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(Route.useSearch).mockReturnValue({ token: undefined });
  vi.mocked(useDataInteractions).mockReturnValue({
    verifyAccount: mockVerifyAccount,
    resendVerificationCode: mockResendCode,
    setupPassword: mockSetupPassword,
  } as ReturnType<typeof useDataInteractions>);
  mockAuth();
});

const fakeSubmit = () =>
  ({ preventDefault: vi.fn() }) as unknown as React.SyntheticEvent;

describe("useVerifyLogic", () => {
  describe("initial stage", () => {
    it("is 'send' when user is logged in without password setup", () => {
      mockAuth({ isUserLoggedIn: true, needsPasswordSetup: false });
      const { result } = renderHook(() => useVerifyLogic());
      expect(result.current.stage).toBe("send");
    });

    it("is 'password' when needsPasswordSetup is true", () => {
      mockAuth({ isUserLoggedIn: true, needsPasswordSetup: true });
      const { result } = renderHook(() => useVerifyLogic());
      expect(result.current.stage).toBe("password");
    });

    it("is 'input' when user is not logged in", () => {
      mockAuth({ isUserLoggedIn: false, needsPasswordSetup: false });
      const { result } = renderHook(() => useVerifyLogic());
      expect(result.current.stage).toBe("input");
    });
  });

  describe("triggerVerification", () => {
    it("advances to 'success' stage on resolve", async () => {
      mockVerifyAccount.mockResolvedValue(undefined);
      const { result } = renderHook(() => useVerifyLogic());

      await act(async () => {
        await result.current.triggerVerification("ABC123");
      });

      expect(mockVerifyAccount).toHaveBeenCalledWith("ABC123");
      expect(result.current.stage).toBe("success");
    });

    it("sets verifyError and clears token on rejection", async () => {
      mockVerifyAccount.mockRejectedValue(new Error("mismatch"));
      const { result } = renderHook(() => useVerifyLogic());

      act(() => result.current.setVerificationToken("WRONG1"));

      await act(async () => {
        await result.current.triggerVerification("WRONG1");
      });

      expect(result.current.verifyError).toBe("verify.codeMismatchError");
      expect(result.current.verificationToken).toBe("");
      expect(result.current.isVerifying).toBe(false);
    });
  });

  describe("URL token auto-verify", () => {
    it("pre-fills the token and triggers verification when url token is 6 chars", async () => {
      mockVerifyAccount.mockResolvedValue(undefined);
      vi.mocked(Route.useSearch).mockReturnValue({ token: "ABCDEF" });

      const { result } = renderHook(() => useVerifyLogic());

      await act(async () => {
        await new Promise((r) => setTimeout(r, 0));
      });

      expect(mockVerifyAccount).toHaveBeenCalledWith("ABCDEF");
    });

    it("does not trigger verification when url token is not 6 chars", async () => {
      vi.mocked(Route.useSearch).mockReturnValue({ token: "ABC" });

      renderHook(() => useVerifyLogic());

      await act(async () => {
        await new Promise((r) => setTimeout(r, 0));
      });

      expect(mockVerifyAccount).not.toHaveBeenCalled();
    });
  });

  describe("triggerSendEmail", () => {
    it("calls resendVerificationCode and advances to 'input' stage", async () => {
      mockResendCode.mockResolvedValue(undefined);
      const { result } = renderHook(() => useVerifyLogic());

      await act(async () => {
        await result.current.triggerSendEmail();
      });

      expect(mockResendCode).toHaveBeenCalledOnce();
      expect(result.current.stage).toBe("input");
      expect(result.current.isSending).toBe(false);
    });

    it("sets sendError on rejection", async () => {
      mockResendCode.mockRejectedValue(new Error("fail"));
      const { result } = renderHook(() => useVerifyLogic());

      await act(async () => {
        await result.current.triggerSendEmail();
      });

      expect(result.current.sendError).toBe("verify.sendError");
      expect(result.current.isSending).toBe(false);
    });
  });

  describe("triggerResend", () => {
    it("calls resendVerificationCode and sets resendSent", async () => {
      mockResendCode.mockResolvedValue(undefined);
      const { result } = renderHook(() => useVerifyLogic());

      await act(async () => {
        await result.current.triggerResend();
      });

      expect(result.current.resendSent).toBe(true);
      expect(result.current.resendError).toBeNull();
      expect(result.current.isSending).toBe(false);
    });

    it("sets resendError on rejection", async () => {
      mockResendCode.mockRejectedValue(new Error("fail"));
      const { result } = renderHook(() => useVerifyLogic());

      await act(async () => {
        await result.current.triggerResend();
      });

      expect(result.current.resendError).toBe("verify.resendError");
      expect(result.current.isSending).toBe(false);
    });
  });

  describe("triggerPasswordSetup", () => {
    it("sets passwordError when passwords do not match", async () => {
      const { result } = renderHook(() => useVerifyLogic());

      act(() => {
        result.current.setPassword("pass1");
        result.current.setConfirmPassword("pass2");
      });

      await act(async () => {
        await result.current.triggerPasswordSetup(fakeSubmit());
      });

      expect(result.current.passwordError).toBe("passwordSetup.mismatch");
      expect(mockSetupPassword).not.toHaveBeenCalled();
    });

    it("calls setupPassword and advances to 'send' stage on success", async () => {
      mockSetupPassword.mockResolvedValue(undefined);
      const { result } = renderHook(() => useVerifyLogic());

      act(() => {
        result.current.setPassword("newpass1");
        result.current.setConfirmPassword("newpass1");
      });

      await act(async () => {
        await result.current.triggerPasswordSetup(fakeSubmit());
      });

      expect(mockSetupPassword).toHaveBeenCalledWith("newpass1");
      expect(result.current.stage).toBe("send");
      expect(result.current.isSettingPassword).toBe(false);
    });

    it("sets passwordError on failure", async () => {
      mockSetupPassword.mockRejectedValue(new Error("error"));
      const { result } = renderHook(() => useVerifyLogic());

      act(() => {
        result.current.setPassword("newpass1");
        result.current.setConfirmPassword("newpass1");
      });

      await act(async () => {
        await result.current.triggerPasswordSetup(fakeSubmit());
      });

      expect(result.current.passwordError).toBe("passwordSetup.error");
      expect(result.current.isSettingPassword).toBe(false);
    });
  });

  it("exposes isBusy as true when isVerifying or isSending", async () => {
    let resolveVerify!: () => void;
    mockVerifyAccount.mockReturnValue(
      new Promise<void>((r) => {
        resolveVerify = r;
      }),
    );
    const { result } = renderHook(() => useVerifyLogic());

    act(() => {
      void result.current.triggerVerification("TOKEN1");
    });

    expect(result.current.isBusy).toBe(true);
    resolveVerify();
  });
});
