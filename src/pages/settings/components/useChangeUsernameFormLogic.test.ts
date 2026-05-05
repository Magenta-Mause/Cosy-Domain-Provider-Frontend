import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useChangeUsernameFormLogic } from "./useChangeUsernameFormLogic";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const onSave = vi.fn();

beforeEach(() => vi.clearAllMocks());

const fakeSubmit = () =>
  ({ preventDefault: vi.fn() }) as unknown as React.SyntheticEvent;

describe("useChangeUsernameFormLogic", () => {
  it("initialises newUsername from the current username", () => {
    const { result } = renderHook(() =>
      useChangeUsernameFormLogic("alice", onSave),
    );
    expect(result.current.newUsername).toBe("alice");
  });

  it("initialises with empty string when currentUsername is null", () => {
    const { result } = renderHook(() =>
      useChangeUsernameFormLogic(null, onSave),
    );
    expect(result.current.newUsername).toBe("");
  });

  describe("canSubmit", () => {
    it("is false when newUsername equals currentUsername", () => {
      const { result } = renderHook(() =>
        useChangeUsernameFormLogic("alice", onSave),
      );
      expect(result.current.canSubmit).toBe(false);
    });

    it("is true when newUsername is valid and different", () => {
      const { result } = renderHook(() =>
        useChangeUsernameFormLogic("alice", onSave),
      );
      act(() => result.current.setNewUsername("bob"));
      expect(result.current.canSubmit).toBe(true);
    });

    it("is false when newUsername is too short", () => {
      const { result } = renderHook(() =>
        useChangeUsernameFormLogic("alice", onSave),
      );
      act(() => result.current.setNewUsername("ab"));
      expect(result.current.canSubmit).toBe(false);
    });
  });

  describe("handleSubmit", () => {
    it("calls onSave with the new username on success", async () => {
      onSave.mockResolvedValue(undefined);
      const { result } = renderHook(() =>
        useChangeUsernameFormLogic("alice", onSave),
      );

      act(() => result.current.setNewUsername("alice2"));

      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });

      expect(onSave).toHaveBeenCalledWith("alice2");
      expect(result.current.success).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it("sets error message on failure", async () => {
      onSave.mockRejectedValue(new Error("conflict"));
      const { result } = renderHook(() =>
        useChangeUsernameFormLogic("alice", onSave),
      );

      act(() => result.current.setNewUsername("alice2"));

      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });

      expect(result.current.error).toBe("settings.usernameError");
      expect(result.current.success).toBe(false);
    });

    it("clears saving after success", async () => {
      onSave.mockResolvedValue(undefined);
      const { result } = renderHook(() =>
        useChangeUsernameFormLogic("alice", onSave),
      );

      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });

      expect(result.current.saving).toBe(false);
    });

    it("clears saving after failure", async () => {
      onSave.mockRejectedValue(new Error("fail"));
      const { result } = renderHook(() =>
        useChangeUsernameFormLogic("alice", onSave),
      );

      await act(async () => {
        await result.current.handleSubmit(fakeSubmit());
      });

      expect(result.current.saving).toBe(false);
    });
  });
});
