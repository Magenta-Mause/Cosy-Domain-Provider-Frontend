import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AdminSubdomain } from "../../../lib";
import { useSubdomainDetailLogic } from "./useSubdomainDetailLogic";

vi.mock("../../../lib", () => ({
  adminApi: {
    updateSubdomainIps: vi.fn(),
    relabelSubdomain: vi.fn(),
    deleteSubdomain: vi.fn(),
  },
}));

const mockT = (key: string) => key;
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: mockT }),
}));

const mockNavigate = vi.fn();
const mockBack = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
  useRouter: () => ({ history: { back: mockBack } }),
}));

import { adminApi } from "../../../lib";

const mockOnSaved = vi.fn();

const baseSub: AdminSubdomain = {
  uuid: "sub-1",
  label: "mysite",
  fqdn: "mysite.cosy-hosting.net",
  targetIp: "1.2.3.4",
  targetIpv6: null,
  status: "ACTIVE",
  labelMode: "CUSTOM",
  ownerUuid: "u1",
  ownerUsername: "alice",
  ownerEmail: "alice@x.com",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

beforeEach(() => {
  vi.clearAllMocks();
  mockNavigate.mockResolvedValue(undefined);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useSubdomainDetailLogic", () => {
  it("derives domainSuffix from fqdn and label", () => {
    const { result } = renderHook(() =>
      useSubdomainDetailLogic(baseSub, "key", mockOnSaved),
    );
    expect(result.current.domainSuffix).toBe(".cosy-hosting.net");
  });

  it("initialises IP fields from subdomain", () => {
    const { result } = renderHook(() =>
      useSubdomainDetailLogic(baseSub, "key", mockOnSaved),
    );
    expect(result.current.targetIp).toBe("1.2.3.4");
    expect(result.current.targetIpv6).toBe("");
  });

  describe("handleSaveIps", () => {
    it("shows error when both IPs are empty", async () => {
      const sub = { ...baseSub, targetIp: null, targetIpv6: null };
      const { result } = renderHook(() =>
        useSubdomainDetailLogic(sub, "key", mockOnSaved),
      );

      await act(async () => {
        await result.current.handleSaveIps();
      });

      expect(result.current.saveIpsError).toBe("admin.saveIpsAtLeastOne");
      expect(adminApi.updateSubdomainIps).not.toHaveBeenCalled();
    });

    it("calls updateSubdomainIps and onSaved on success", async () => {
      vi.mocked(adminApi.updateSubdomainIps).mockResolvedValue(baseSub);
      const { result } = renderHook(() =>
        useSubdomainDetailLogic(baseSub, "key", mockOnSaved),
      );

      await act(async () => {
        await result.current.handleSaveIps();
      });

      expect(adminApi.updateSubdomainIps).toHaveBeenCalledWith("key", "sub-1", {
        targetIp: "1.2.3.4",
        targetIpv6: undefined,
      });
      expect(mockOnSaved).toHaveBeenCalledOnce();
    });

    it("sets saveIpsError on failure", async () => {
      vi.mocked(adminApi.updateSubdomainIps).mockRejectedValue(
        new Error("fail"),
      );
      const { result } = renderHook(() =>
        useSubdomainDetailLogic(baseSub, "key", mockOnSaved),
      );

      await act(async () => {
        await result.current.handleSaveIps();
      });

      expect(result.current.saveIpsError).toBe("admin.saveIpsError");
      expect(result.current.isSavingIps).toBe(false);
    });
  });

  describe("handleSaveLabel", () => {
    it("calls relabelSubdomain and onSaved on success", async () => {
      vi.mocked(adminApi.relabelSubdomain).mockResolvedValue(baseSub);
      const { result } = renderHook(() =>
        useSubdomainDetailLogic(baseSub, "key", mockOnSaved),
      );

      act(() => result.current.setLabel("newlabel"));

      await act(async () => {
        await result.current.handleSaveLabel();
      });

      expect(adminApi.relabelSubdomain).toHaveBeenCalledWith(
        "key",
        "sub-1",
        "newlabel",
      );
      expect(mockOnSaved).toHaveBeenCalledOnce();
    });

    it("sets saveLabelError on failure", async () => {
      vi.mocked(adminApi.relabelSubdomain).mockRejectedValue(new Error("fail"));
      const { result } = renderHook(() =>
        useSubdomainDetailLogic(baseSub, "key", mockOnSaved),
      );

      await act(async () => {
        await result.current.handleSaveLabel();
      });

      expect(result.current.saveLabelError).toBe("admin.saveLabelError");
    });
  });

  describe("handleDeleteSubdomain", () => {
    it("does nothing when confirm returns false", async () => {
      vi.stubGlobal("confirm", vi.fn().mockReturnValue(false));
      const { result } = renderHook(() =>
        useSubdomainDetailLogic(baseSub, "key", mockOnSaved),
      );

      await act(async () => {
        await result.current.handleDeleteSubdomain();
      });

      expect(adminApi.deleteSubdomain).not.toHaveBeenCalled();
    });

    it("deletes and navigates to /admin/subdomains on success", async () => {
      vi.stubGlobal("confirm", vi.fn().mockReturnValue(true));
      vi.mocked(adminApi.deleteSubdomain).mockResolvedValue(undefined);
      const { result } = renderHook(() =>
        useSubdomainDetailLogic(baseSub, "key", mockOnSaved),
      );

      await act(async () => {
        await result.current.handleDeleteSubdomain();
      });

      expect(adminApi.deleteSubdomain).toHaveBeenCalledWith("key", "sub-1");
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/admin/subdomains" });
    });

    it("sets deleteError on failure", async () => {
      vi.stubGlobal("confirm", vi.fn().mockReturnValue(true));
      vi.mocked(adminApi.deleteSubdomain).mockRejectedValue(new Error("fail"));
      const { result } = renderHook(() =>
        useSubdomainDetailLogic(baseSub, "key", mockOnSaved),
      );

      await act(async () => {
        await result.current.handleDeleteSubdomain();
      });

      expect(result.current.deleteError).toBe("admin.deleteSubdomainError");
      expect(result.current.isDeleting).toBe(false);
    });
  });

  it("handleBack calls router.history.back()", () => {
    const { result } = renderHook(() =>
      useSubdomainDetailLogic(baseSub, "key", mockOnSaved),
    );
    result.current.handleBack();
    expect(mockBack).toHaveBeenCalledOnce();
  });
});
