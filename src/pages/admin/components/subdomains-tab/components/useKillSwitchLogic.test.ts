import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useKillSwitchLogic } from "./useKillSwitchLogic";

vi.mock("../../../lib", () => ({
  adminApi: {
    getSettings: vi.fn(),
    updateSettings: vi.fn(),
  },
}));

import { adminApi } from "../../../lib";

beforeEach(() => vi.clearAllMocks());

describe("useKillSwitchLogic", () => {
  it("loads settings on mount and clears isLoading", async () => {
    vi.mocked(adminApi.getSettings).mockResolvedValue({
      domainCreationEnabled: false,
    });

    const { result } = renderHook(() => useKillSwitchLogic("admin-key"));

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(adminApi.getSettings).toHaveBeenCalledWith("admin-key");
    expect(result.current.domainCreationEnabled).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it("defaults to domainCreationEnabled true while loading", () => {
    vi.mocked(adminApi.getSettings).mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useKillSwitchLogic("admin-key"));
    expect(result.current.domainCreationEnabled).toBe(true);
    expect(result.current.isLoading).toBe(true);
  });

  describe("toggle", () => {
    it("calls updateSettings with the opposite value and updates state", async () => {
      vi.mocked(adminApi.getSettings).mockResolvedValue({
        domainCreationEnabled: true,
      });
      vi.mocked(adminApi.updateSettings).mockResolvedValue({
        domainCreationEnabled: false,
      });

      const { result } = renderHook(() => useKillSwitchLogic("admin-key"));

      await act(async () => {
        await new Promise((r) => setTimeout(r, 0));
      });

      await act(async () => {
        await result.current.toggle();
      });

      expect(adminApi.updateSettings).toHaveBeenCalledWith("admin-key", {
        domainCreationEnabled: false,
      });
      expect(result.current.domainCreationEnabled).toBe(false);
      expect(result.current.isToggling).toBe(false);
    });

    it("clears isToggling even when updateSettings throws", async () => {
      vi.mocked(adminApi.getSettings).mockResolvedValue({
        domainCreationEnabled: true,
      });
      vi.mocked(adminApi.updateSettings).mockRejectedValue(new Error("fail"));

      const { result } = renderHook(() => useKillSwitchLogic("admin-key"));

      await act(async () => {
        await new Promise((r) => setTimeout(r, 0));
      });

      await act(async () => {
        await result.current.toggle().catch(() => {});
      });

      expect(result.current.isToggling).toBe(false);
    });
  });
});
