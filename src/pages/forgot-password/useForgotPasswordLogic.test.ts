import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useForgotPasswordLogic } from "./useForgotPasswordLogic";

vi.mock("@/hooks/useDataInteractions/useDataInteractions", () => ({
  default: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/routes/forgot-password", () => ({
  Route: { useSearch: vi.fn() },
}));

import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";
import { Route } from "@/routes/forgot-password";

const mockRequestReset = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(Route.useSearch).mockReturnValue({ email: undefined });
  vi.mocked(useDataInteractions).mockReturnValue({
    requestPasswordReset: mockRequestReset,
  } as unknown as ReturnType<typeof useDataInteractions>);
});

const fakeSubmit = (_email = "user@example.com") =>
  ({
    preventDefault: vi.fn(),
  }) as unknown as React.SyntheticEvent<HTMLFormElement>;

describe("useForgotPasswordLogic", () => {
  it("initialises with empty email when no prefill", () => {
    const { result } = renderHook(() => useForgotPasswordLogic());
    expect(result.current.email).toBe("");
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.success).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("pre-fills email from route search params", () => {
    vi.mocked(Route.useSearch).mockReturnValue({ email: "pre@example.com" });
    const { result } = renderHook(() => useForgotPasswordLogic());
    expect(result.current.email).toBe("pre@example.com");
  });

  it("setEmail updates the email field", () => {
    const { result } = renderHook(() => useForgotPasswordLogic());
    act(() => result.current.setEmail("new@example.com"));
    expect(result.current.email).toBe("new@example.com");
  });

  describe("handleSubmit", () => {
    it("calls requestPasswordReset and sets success on resolve", async () => {
      mockRequestReset.mockResolvedValue(undefined);
      const { result } = renderHook(() => useForgotPasswordLogic());

      act(() => result.current.setEmail("user@example.com"));

      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });

      expect(mockRequestReset).toHaveBeenCalledWith("user@example.com");
      expect(result.current.success).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it("sets error message and clears success on rejection", async () => {
      mockRequestReset.mockRejectedValue(new Error("not found"));
      const { result } = renderHook(() => useForgotPasswordLogic());

      act(() => result.current.setEmail("user@example.com"));

      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });

      expect(result.current.success).toBe(false);
      expect(result.current.error).toBe("forgotPassword.error");
    });

    it("clears isSubmitting after success", async () => {
      mockRequestReset.mockResolvedValue(undefined);
      const { result } = renderHook(() => useForgotPasswordLogic());

      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });

      expect(result.current.isSubmitting).toBe(false);
    });

    it("clears isSubmitting after failure", async () => {
      mockRequestReset.mockRejectedValue(new Error("fail"));
      const { result } = renderHook(() => useForgotPasswordLogic());

      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });

      expect(result.current.isSubmitting).toBe(false);
    });
  });
});
