import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useMfaSetupLogic } from "./useMfaSetupLogic";

vi.mock("@/hooks/useDataInteractions/useDataInteractions", () => ({
  default: vi.fn(),
}));

// Stable `t` reference — prevents useCallback([..., t]) from recreating on every render
const mockT = (key: string) => key;
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: mockT }),
}));

const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";

const mockSetupMfa = vi.fn();
const mockConfirmMfa = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  mockNavigate.mockResolvedValue(undefined);
  vi.mocked(useDataInteractions).mockReturnValue({
    setupMfa: mockSetupMfa,
    confirmMfa: mockConfirmMfa,
  } as ReturnType<typeof useDataInteractions>);
});

describe("useMfaSetupLogic", () => {
  it("calls setupMfa on mount and stores totpUri and secret", async () => {
    mockSetupMfa.mockResolvedValue({ totpUri: "otpauth://totp/...", secret: "ABCDEF" });
    const { result } = renderHook(() => useMfaSetupLogic());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockSetupMfa).toHaveBeenCalledOnce();
    expect(result.current.totpUri).toBe("otpauth://totp/...");
    expect(result.current.secret).toBe("ABCDEF");
    expect(result.current.isLoading).toBe(false);
  });

  it("sets setupError when setupMfa fails", async () => {
    mockSetupMfa.mockRejectedValue(new Error("network error"));
    const { result } = renderHook(() => useMfaSetupLogic());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.setupError).toBe("mfaSetup.setupError");
    expect(result.current.isLoading).toBe(false);
  });

  describe("handleConfirm", () => {
    it("is a no-op when code length is not 6", async () => {
      mockSetupMfa.mockResolvedValue({ totpUri: "uri", secret: "SEC" });
      const { result } = renderHook(() => useMfaSetupLogic());

      act(() => result.current.setTotpCode("123"));
      await act(async () => {
        await result.current.handleConfirm();
      });

      expect(mockConfirmMfa).not.toHaveBeenCalled();
    });

    it("calls confirmMfa and navigates to /dashboard on success", async () => {
      mockSetupMfa.mockResolvedValue({ totpUri: "uri", secret: "SEC" });
      // Second call hangs so isConfirming stays true and the auto-confirm effect short-circuits
      mockConfirmMfa
        .mockResolvedValueOnce(undefined)
        .mockReturnValue(new Promise(() => {}));

      const { result, unmount } = renderHook(() => useMfaSetupLogic());

      await act(async () => {
        result.current.setTotpCode("123456");
        await new Promise((r) => setTimeout(r, 0));
      });

      expect(mockConfirmMfa).toHaveBeenCalledWith("123456");
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/dashboard" });
      unmount();
    });

    it("sets confirmError and clears code on failure", async () => {
      mockSetupMfa.mockResolvedValue({ totpUri: "uri", secret: "SEC" });
      mockConfirmMfa.mockRejectedValue(new Error("wrong code"));

      const { result } = renderHook(() => useMfaSetupLogic());

      await act(async () => {
        result.current.setTotpCode("123456");
        await new Promise((r) => setTimeout(r, 0));
      });

      expect(result.current.confirmError).toBe("mfaSetup.confirmError");
      expect(result.current.totpCode).toBe("");
    });

    it("clears isConfirming after failure", async () => {
      mockSetupMfa.mockResolvedValue({ totpUri: "uri", secret: "SEC" });
      mockConfirmMfa.mockRejectedValue(new Error("fail"));

      const { result } = renderHook(() => useMfaSetupLogic());

      await act(async () => {
        result.current.setTotpCode("123456");
        await new Promise((r) => setTimeout(r, 0));
      });

      expect(result.current.isConfirming).toBe(false);
    });
  });
});
