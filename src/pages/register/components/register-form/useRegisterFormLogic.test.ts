import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeWrapper } from "@/test/store-utils";
import { useRegisterFormLogic } from "./useRegisterFormLogic";

vi.mock("@/hooks/useDataInteractions/useDataInteractions", () => ({
  default: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";

const mockRegisterUser = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  mockNavigate.mockResolvedValue(undefined);
  vi.mocked(useDataInteractions).mockReturnValue({
    registerUser: mockRegisterUser,
  } as unknown as ReturnType<typeof useDataInteractions>);
});

const fakeSubmit = () =>
  ({
    preventDefault: vi.fn(),
  }) as unknown as React.SyntheticEvent<HTMLFormElement>;

function fillStep1(result: ReturnType<typeof useRegisterFormLogic>) {
  act(() => {
    result.setUsername("alice");
    result.setEmail("alice@example.com");
  });
}

describe("useRegisterFormLogic", () => {
  it("starts at step 1 with empty fields and canSubmit false", () => {
    const { result } = renderHook(() => useRegisterFormLogic(), {
      wrapper: makeWrapper(),
    });
    expect(result.current.step).toBe(1);
    expect(result.current.canSubmit).toBe(false);
    expect(result.current.errorMessage).toBeNull();
  });

  describe("canSubmit", () => {
    it("is false when required fields are missing", () => {
      const { result } = renderHook(() => useRegisterFormLogic(), {
        wrapper: makeWrapper(),
      });
      expect(result.current.canSubmit).toBe(false);
    });

    it("is true when all conditions are met", () => {
      const { result } = renderHook(() => useRegisterFormLogic(), {
        wrapper: makeWrapper(),
      });

      act(() => {
        result.current.setUsername("alice");
        result.current.setEmail("alice@example.com");
        result.current.setPassword("strongpass1");
        result.current.setConfirmPassword("strongpass1");
        result.current.setAgreed(true);
        result.current.setCaptchaToken("cap");
      });

      expect(result.current.canSubmit).toBe(true);
    });

    it("is false when passwords do not match", () => {
      const { result } = renderHook(() => useRegisterFormLogic(), {
        wrapper: makeWrapper(),
      });

      act(() => {
        result.current.setUsername("alice");
        result.current.setEmail("alice@example.com");
        result.current.setPassword("strongpass1");
        result.current.setConfirmPassword("differentpass");
        result.current.setAgreed(true);
        result.current.setCaptchaToken("cap");
      });

      expect(result.current.canSubmit).toBe(false);
      expect(result.current.confirmValid).toBe(false);
    });

    it("is false when agreed is not checked", () => {
      const { result } = renderHook(() => useRegisterFormLogic(), {
        wrapper: makeWrapper(),
      });

      act(() => {
        result.current.setUsername("alice");
        result.current.setEmail("alice@example.com");
        result.current.setPassword("strongpass1");
        result.current.setConfirmPassword("strongpass1");
        result.current.setAgreed(false);
        result.current.setCaptchaToken("cap");
      });

      expect(result.current.canSubmit).toBe(false);
    });
  });

  describe("passwordWeak", () => {
    it("is true for a non-empty password below the minimum length", () => {
      const { result } = renderHook(() => useRegisterFormLogic(), {
        wrapper: makeWrapper(),
      });
      act(() => result.current.setPassword("short"));
      expect(result.current.passwordWeak).toBe(true);
    });

    it("is false for an empty password", () => {
      const { result } = renderHook(() => useRegisterFormLogic(), {
        wrapper: makeWrapper(),
      });
      expect(result.current.passwordWeak).toBe(false);
    });
  });

  describe("step 1 — username and email", () => {
    it("stays on step 1 when email is invalid", async () => {
      const { result } = renderHook(() => useRegisterFormLogic(), {
        wrapper: makeWrapper(),
      });

      act(() => {
        result.current.setUsername("alice");
        result.current.setEmail("not-valid");
      });

      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });

      expect(result.current.step).toBe(1);
    });

    it("advances to step 2 when email is valid", async () => {
      const { result } = renderHook(() => useRegisterFormLogic(), {
        wrapper: makeWrapper(),
      });

      fillStep1(result.current);

      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });

      expect(result.current.step).toBe(2);
    });
  });

  describe("step 2 — password + captcha + submit", () => {
    async function advanceToStep2(result: {
      current: ReturnType<typeof useRegisterFormLogic>;
    }) {
      fillStep1(result.current);
      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });
    }

    it("sets captchaError when captcha token is missing", async () => {
      const { result } = renderHook(() => useRegisterFormLogic(), {
        wrapper: makeWrapper(),
      });

      await advanceToStep2(result);
      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });

      expect(result.current.errorMessage).toBe("register.captchaError");
    });

    it("navigates to /dashboard on successful registration", async () => {
      mockRegisterUser.mockResolvedValue(undefined);
      const { result } = renderHook(() => useRegisterFormLogic(), {
        wrapper: makeWrapper(),
      });

      await advanceToStep2(result);
      act(() => {
        result.current.setPassword("strongpass1");
        result.current.setConfirmPassword("strongpass1");
        result.current.setAgreed(true);
        result.current.setCaptchaToken("cap");
      });

      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });

      expect(mockRegisterUser).toHaveBeenCalledWith({
        username: "alice",
        email: "alice@example.com",
        password: "strongpass1",
        captchaToken: "cap",
      });
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/dashboard" });
    });

    it("sets errorMessage on registration failure", async () => {
      mockRegisterUser.mockRejectedValue(new Error("conflict"));
      const { result } = renderHook(() => useRegisterFormLogic(), {
        wrapper: makeWrapper(),
      });

      await advanceToStep2(result);
      act(() => {
        result.current.setPassword("strongpass1");
        result.current.setConfirmPassword("strongpass1");
        result.current.setAgreed(true);
        result.current.setCaptchaToken("cap");
      });

      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });

      expect(result.current.errorMessage).toBe("register.error");
    });
  });

  describe("goBack", () => {
    it("resets to step 1 and clears password fields", async () => {
      const { result } = renderHook(() => useRegisterFormLogic(), {
        wrapper: makeWrapper(),
      });

      fillStep1(result.current);
      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });
      expect(result.current.step).toBe(2);

      act(() => result.current.goBack());

      expect(result.current.step).toBe(1);
      expect(result.current.password).toBe("");
      expect(result.current.confirmPassword).toBe("");
      expect(result.current.errorMessage).toBeNull();
    });
  });
});
