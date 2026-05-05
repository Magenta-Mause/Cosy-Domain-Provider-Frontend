import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useResetPasswordLogic } from "./useResetPasswordLogic";

vi.mock("@/hooks/useDataInteractions/useDataInteractions", () => ({
  default: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/routes/reset-password", () => ({
  Route: { useSearch: vi.fn() },
}));

import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";
import { Route } from "@/routes/reset-password";

const mockConfirmReset = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.mocked(Route.useSearch).mockReturnValue({ token: "reset-tok" });
  vi.mocked(useDataInteractions).mockReturnValue({
    confirmPasswordReset: mockConfirmReset,
  } as ReturnType<typeof useDataInteractions>);
});

afterEach(() => {
  vi.useRealTimers();
});

const fakeSubmit = () =>
  ({ preventDefault: vi.fn() }) as unknown as React.SyntheticEvent<HTMLFormElement>;

describe("useResetPasswordLogic", () => {
  it("exposes the token from route search params", () => {
    const { result } = renderHook(() => useResetPasswordLogic());
    expect(result.current.token).toBe("reset-tok");
  });

  it("initialises with empty password and idle state", () => {
    const { result } = renderHook(() => useResetPasswordLogic());
    expect(result.current.newPassword).toBe("");
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.success).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("setNewPassword updates the field", () => {
    const { result } = renderHook(() => useResetPasswordLogic());
    act(() => result.current.setNewPassword("newPass123"));
    expect(result.current.newPassword).toBe("newPass123");
  });

  describe("handleSubmit", () => {
    it("calls confirmPasswordReset with token and password on success", async () => {
      mockConfirmReset.mockResolvedValue(undefined);
      const { result } = renderHook(() => useResetPasswordLogic());

      act(() => result.current.setNewPassword("hunter2!"));

      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });

      expect(mockConfirmReset).toHaveBeenCalledWith("reset-tok", "hunter2!");
      expect(result.current.success).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it("sets error message on rejection", async () => {
      mockConfirmReset.mockRejectedValue(new Error("invalid token"));
      const { result } = renderHook(() => useResetPasswordLogic());

      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });

      expect(result.current.success).toBe(false);
      expect(result.current.error).toBe("resetPassword.error");
    });

    it("clears isSubmitting after success", async () => {
      mockConfirmReset.mockResolvedValue(undefined);
      const { result } = renderHook(() => useResetPasswordLogic());

      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });

      expect(result.current.isSubmitting).toBe(false);
    });

    it("clears isSubmitting after failure", async () => {
      mockConfirmReset.mockRejectedValue(new Error("fail"));
      const { result } = renderHook(() => useResetPasswordLogic());

      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });

      expect(result.current.isSubmitting).toBe(false);
    });
  });
});
