import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeWrapper } from "@/test/store-utils";
import { useLoginFormLogic } from "./useLoginFormLogic";

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

vi.mock("@/routes/login", () => ({
  Route: { useSearch: vi.fn() },
}));

import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";
import { Route } from "@/routes/login";

const mockLoginUser = vi.fn();
const mockCompleteMfa = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  mockNavigate.mockResolvedValue(undefined);
  vi.mocked(Route.useSearch).mockReturnValue({ oauthError: undefined });
  vi.mocked(useDataInteractions).mockReturnValue({
    loginUser: mockLoginUser,
    completeMfaChallenge: mockCompleteMfa,
  } as unknown as ReturnType<typeof useDataInteractions>);
});

const fakeSubmit = () =>
  ({
    preventDefault: vi.fn(),
  }) as unknown as React.SyntheticEvent<HTMLFormElement>;

describe("useLoginFormLogic", () => {
  it("starts at step 1 with empty fields", () => {
    const { result } = renderHook(() => useLoginFormLogic(), {
      wrapper: makeWrapper(),
    });
    expect(result.current.step).toBe(1);
    expect(result.current.email).toBe("");
    expect(result.current.password).toBe("");
    expect(result.current.emailError).toBeNull();
    expect(result.current.errorMessage).toBeNull();
  });

  it("exposes oauthError as false when not set", () => {
    const { result } = renderHook(() => useLoginFormLogic(), {
      wrapper: makeWrapper(),
    });
    expect(result.current.oauthError).toBe(false);
  });

  it("exposes oauthError as true when set in route params", () => {
    vi.mocked(Route.useSearch).mockReturnValue({ oauthError: true });
    const { result } = renderHook(() => useLoginFormLogic(), {
      wrapper: makeWrapper(),
    });
    expect(result.current.oauthError).toBe(true);
  });

  describe("step 1 — email entry", () => {
    it("shows emailError and stays on step 1 for an invalid email", async () => {
      const { result } = renderHook(() => useLoginFormLogic(), {
        wrapper: makeWrapper(),
      });

      act(() => result.current.setEmail("not-an-email"));

      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });

      expect(result.current.step).toBe(1);
      expect(result.current.emailError).toBe("login.emailInvalid");
    });

    it("advances to step 2 for a valid email", async () => {
      const { result } = renderHook(() => useLoginFormLogic(), {
        wrapper: makeWrapper(),
      });

      act(() => result.current.setEmail("user@example.com"));

      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });

      expect(result.current.step).toBe(2);
      expect(result.current.emailError).toBeNull();
    });
  });

  describe("step 2 — password + captcha", () => {
    async function advanceToStep2(result: {
      current: ReturnType<typeof useLoginFormLogic>;
    }) {
      act(() => result.current.setEmail("user@example.com"));
      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });
    }

    it("shows captchaError when captcha token is missing", async () => {
      const { result } = renderHook(() => useLoginFormLogic(), {
        wrapper: makeWrapper(),
      });

      await advanceToStep2(result);
      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });

      expect(result.current.errorMessage).toBe("login.captchaError");
    });

    it("navigates to /dashboard after successful login with verified user", async () => {
      mockLoginUser.mockResolvedValue({ isVerified: true, sub: "u1" });
      const { result } = renderHook(() => useLoginFormLogic(), {
        wrapper: makeWrapper(),
      });

      await advanceToStep2(result);
      act(() => result.current.setCaptchaToken("tok"));

      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/dashboard" });
    });

    it("navigates to /verify after successful login with unverified user", async () => {
      mockLoginUser.mockResolvedValue({ isVerified: false });
      const { result } = renderHook(() => useLoginFormLogic(), {
        wrapper: makeWrapper(),
      });

      await advanceToStep2(result);
      act(() => result.current.setCaptchaToken("tok"));

      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/verify" });
    });

    it("advances to step 3 when MFA is required", async () => {
      mockLoginUser.mockResolvedValue({
        mfaRequired: true,
        challengeToken: "mfa-tok",
      });
      const { result } = renderHook(() => useLoginFormLogic(), {
        wrapper: makeWrapper(),
      });

      await advanceToStep2(result);
      act(() => result.current.setCaptchaToken("tok"));

      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });

      expect(result.current.step).toBe(3);
    });

    it("sets errorMessage on login failure", async () => {
      mockLoginUser.mockRejectedValue(new Error("bad credentials"));
      const { result } = renderHook(() => useLoginFormLogic(), {
        wrapper: makeWrapper(),
      });

      await advanceToStep2(result);
      act(() => result.current.setCaptchaToken("tok"));

      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });

      expect(result.current.errorMessage).toBe("login.error");
    });
  });

  describe("goBack", () => {
    it("resets to step 1 and clears all fields and errors", async () => {
      const { result } = renderHook(() => useLoginFormLogic(), {
        wrapper: makeWrapper(),
      });

      act(() => result.current.setEmail("user@example.com"));
      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });
      expect(result.current.step).toBe(2);

      act(() => result.current.goBack());

      expect(result.current.step).toBe(1);
      expect(result.current.password).toBe("");
      expect(result.current.emailError).toBeNull();
      expect(result.current.errorMessage).toBeNull();
    });
  });
});
