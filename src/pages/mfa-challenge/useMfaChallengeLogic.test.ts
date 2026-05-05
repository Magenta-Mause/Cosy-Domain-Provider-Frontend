import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useMfaChallengeLogic } from "./useMfaChallengeLogic";

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

vi.mock("@/routes/mfa-challenge", () => ({
  Route: { useSearch: vi.fn() },
}));

import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";
import { Route } from "@/routes/mfa-challenge";

const mockCompleteMfa = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  mockNavigate.mockResolvedValue(undefined);
  vi.mocked(Route.useSearch).mockReturnValue({ token: "challenge-tok" });
  vi.mocked(useDataInteractions).mockReturnValue({
    completeMfaChallenge: mockCompleteMfa,
  } as ReturnType<typeof useDataInteractions>);
});

describe("useMfaChallengeLogic", () => {
  it("initialises with empty totpCode and no error", () => {
    const { result } = renderHook(() => useMfaChallengeLogic());
    expect(result.current.totpCode).toBe("");
    expect(result.current.totpError).toBeNull();
    expect(result.current.isSubmitting).toBe(false);
  });

  it("handleConfirm is a no-op when code length is not 6", async () => {
    const { result } = renderHook(() => useMfaChallengeLogic());
    act(() => result.current.setTotpCode("123"));

    await act(async () => {
      await result.current.handleConfirm();
    });

    expect(mockCompleteMfa).not.toHaveBeenCalled();
  });

  it("navigates to /dashboard after successful MFA for a verified user", async () => {
    // First call resolves; second call (from the auto-confirm loop) hangs so
    // isSubmitting stays true and the effect short-circuits.
    mockCompleteMfa
      .mockResolvedValueOnce({ isVerified: true })
      .mockReturnValue(new Promise(() => {}));

    const { result, unmount } = renderHook(() => useMfaChallengeLogic());

    await act(async () => {
      result.current.setTotpCode("123456");
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockCompleteMfa).toHaveBeenCalledWith("challenge-tok", "123456");
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/dashboard" });
    unmount();
  });

  it("navigates to /verify after successful MFA for an unverified user", async () => {
    mockCompleteMfa
      .mockResolvedValueOnce({ isVerified: false })
      .mockReturnValue(new Promise(() => {}));

    const { result, unmount } = renderHook(() => useMfaChallengeLogic());

    await act(async () => {
      result.current.setTotpCode("123456");
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(mockNavigate).toHaveBeenCalledWith({ to: "/verify" });
    unmount();
  });

  it("sets totpError and clears the code on failure", async () => {
    mockCompleteMfa.mockRejectedValue(new Error("wrong code"));
    const { result } = renderHook(() => useMfaChallengeLogic());

    await act(async () => {
      result.current.setTotpCode("123456");
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.totpError).toBe("login.mfaError");
    expect(result.current.totpCode).toBe("");
  });

  it("clears isSubmitting after failure", async () => {
    mockCompleteMfa.mockRejectedValue(new Error("fail"));
    const { result } = renderHook(() => useMfaChallengeLogic());

    await act(async () => {
      result.current.setTotpCode("123456");
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.isSubmitting).toBe(false);
  });
});
