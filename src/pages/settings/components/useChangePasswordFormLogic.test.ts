import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useChangePasswordFormLogic } from "./useChangePasswordFormLogic";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const onSave = vi.fn();

beforeEach(() => vi.clearAllMocks());

const fakeSubmit = () =>
  ({ preventDefault: vi.fn() }) as unknown as React.SyntheticEvent;

describe("useChangePasswordFormLogic", () => {
  it("initialises with empty fields and all flags false", () => {
    const { result } = renderHook(() => useChangePasswordFormLogic(onSave));
    expect(result.current.currentPassword).toBe("");
    expect(result.current.newPassword).toBe("");
    expect(result.current.confirmPassword).toBe("");
    expect(result.current.saving).toBe(false);
    expect(result.current.success).toBe(false);
    expect(result.current.error).toBeNull();
  });

  describe("canSubmit", () => {
    it("is false with empty fields", () => {
      const { result } = renderHook(() => useChangePasswordFormLogic(onSave));
      expect(result.current.canSubmit).toBe(false);
    });

    it("is true when all conditions are met", () => {
      const { result } = renderHook(() => useChangePasswordFormLogic(onSave));
      act(() => {
        result.current.setCurrentPassword("old");
        result.current.setNewPassword("newpass1");
        result.current.setConfirmPassword("newpass1");
      });
      expect(result.current.canSubmit).toBe(true);
    });

    it("is false when passwords do not match", () => {
      const { result } = renderHook(() => useChangePasswordFormLogic(onSave));
      act(() => {
        result.current.setCurrentPassword("old");
        result.current.setNewPassword("newpass1");
        result.current.setConfirmPassword("different");
      });
      expect(result.current.canSubmit).toBe(false);
      expect(result.current.passwordsMatch).toBe(false);
    });

    it("is false when newPassword is too short", () => {
      const { result } = renderHook(() => useChangePasswordFormLogic(onSave));
      act(() => {
        result.current.setCurrentPassword("old");
        result.current.setNewPassword("short");
        result.current.setConfirmPassword("short");
      });
      expect(result.current.canSubmit).toBe(false);
      expect(result.current.newPasswordWeak).toBe(true);
    });
  });

  describe("visibility toggles", () => {
    it("toggles showCurrentPw, showNewPw, showConfirmPw", () => {
      const { result } = renderHook(() => useChangePasswordFormLogic(onSave));
      act(() => result.current.setShowCurrentPw(true));
      expect(result.current.showCurrentPw).toBe(true);
      act(() => result.current.setShowNewPw(true));
      expect(result.current.showNewPw).toBe(true);
      act(() => result.current.setShowConfirmPw(true));
      expect(result.current.showConfirmPw).toBe(true);
    });
  });

  describe("handleSubmit", () => {
    it("calls onSave with currentPassword and newPassword on success", async () => {
      onSave.mockResolvedValue(undefined);
      const { result } = renderHook(() => useChangePasswordFormLogic(onSave));

      act(() => {
        result.current.setCurrentPassword("oldpass");
        result.current.setNewPassword("newpass1");
        result.current.setConfirmPassword("newpass1");
      });

      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });

      expect(onSave).toHaveBeenCalledWith("oldpass", "newpass1");
      expect(result.current.success).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it("clears password fields on success", async () => {
      onSave.mockResolvedValue(undefined);
      const { result } = renderHook(() => useChangePasswordFormLogic(onSave));

      act(() => {
        result.current.setCurrentPassword("oldpass");
        result.current.setNewPassword("newpass1");
        result.current.setConfirmPassword("newpass1");
      });

      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });

      expect(result.current.currentPassword).toBe("");
      expect(result.current.newPassword).toBe("");
      expect(result.current.confirmPassword).toBe("");
    });

    it("sets a 401-specific error message on wrong current password", async () => {
      onSave.mockRejectedValue({ response: { status: 401 } });
      const { result } = renderHook(() => useChangePasswordFormLogic(onSave));

      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });

      expect(result.current.error).toBe("settings.wrongCurrentPassword");
    });

    it("sets a generic error message for non-401 failures", async () => {
      onSave.mockRejectedValue({ response: { status: 500 } });
      const { result } = renderHook(() => useChangePasswordFormLogic(onSave));

      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });

      expect(result.current.error).toBe("settings.passwordError");
    });

    it("clears saving after success", async () => {
      onSave.mockResolvedValue(undefined);
      const { result } = renderHook(() => useChangePasswordFormLogic(onSave));

      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });

      expect(result.current.saving).toBe(false);
    });

    it("clears saving after failure", async () => {
      onSave.mockRejectedValue(new Error("fail"));
      const { result } = renderHook(() => useChangePasswordFormLogic(onSave));

      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });

      expect(result.current.saving).toBe(false);
    });
  });
});
