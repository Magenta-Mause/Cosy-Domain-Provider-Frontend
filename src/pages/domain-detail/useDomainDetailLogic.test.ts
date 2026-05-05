import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { makeWrapper } from "@/test/store-utils";
import type { SubdomainDto } from "@/api/generated/model";

vi.mock("@/hooks/useAuthInformation/useAuthInformation", () => ({
  default: () => mockAuthInfo,
}));

vi.mock("@/hooks/useDataInteractions/useDataInteractions", () => ({
  default: () => mockDataInteractions,
}));

vi.mock("@/hooks/useDataLoading/useDataLoading", () => ({
  default: () => mockDataLoading,
}));

vi.mock("@/api/billing-api", () => ({
  checkLabelAvailability: vi.fn(),
}));

const mockT = (key: string) => key;
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: mockT, i18n: { language: "en" } }),
}));

const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

const mockAuthInfo = { userTier: "FREE" as const, isVerified: true };
const mockCreateSubdomain = vi.fn();
const mockUpdateSubdomain = vi.fn();
const mockDeleteSubdomain = vi.fn();
const mockLoadSubdomainByUuid = vi.fn();

const mockDataInteractions = {
  createSubdomain: mockCreateSubdomain,
  updateSubdomain: mockUpdateSubdomain,
  deleteSubdomain: mockDeleteSubdomain,
};
const mockDataLoading = { loadSubdomainByUuid: mockLoadSubdomainByUuid };

import { checkLabelAvailability } from "@/api/billing-api";
import { useDomainDetailLogic } from "./useDomainDetailLogic";

const baseSub: SubdomainDto = {
  uuid: "sub-1",
  label: "mysite",
  fqdn: "mysite.cosy-hosting.net",
  targetIp: "1.2.3.4",
  targetIpv6: null,
  status: "ACTIVE",
  labelMode: "CUSTOM",
  createdAt: "2024-01-01T00:00:00Z",
};

beforeEach(() => {
  vi.clearAllMocks();
  mockNavigate.mockResolvedValue(undefined);
  (mockAuthInfo as { userTier: string; isVerified: boolean }).userTier = "FREE";
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useDomainDetailLogic", () => {
  describe("edit mode (existing subdomain from Redux cache)", () => {
    function renderEdit(sub = baseSub) {
      return renderHook(() => useDomainDetailLogic(sub.uuid!), {
        wrapper: makeWrapper({
          subdomains: {
            items: [sub],
            state: "idle",
            error: null,
          },
        }),
      });
    }

    it("loads IP fields from cached subdomain", () => {
      const { result } = renderEdit();
      expect(result.current.targetIp).toBe("1.2.3.4");
      expect(result.current.targetIpv6).toBe("");
      expect(result.current.label).toBe("mysite");
      expect(result.current.isCreateMode).toBe(false);
    });

    it("canSubmit is false when IPs unchanged", () => {
      const { result } = renderEdit();
      expect(result.current.canSubmit).toBe(false);
    });

    it("canSubmit is true after changing an IP", () => {
      const { result } = renderEdit();
      act(() => result.current.setTargetIp("9.9.9.9"));
      expect(result.current.canSubmit).toBe(true);
    });

    it("handleSubmit calls updateSubdomain and does not navigate", async () => {
      mockUpdateSubdomain.mockResolvedValue({ ...baseSub, targetIp: "9.9.9.9" });
      const { result } = renderEdit();
      act(() => result.current.setTargetIp("9.9.9.9"));

      await act(async () => {
        await result.current.handleSubmit({
          preventDefault: vi.fn(),
        } as never);
      });

      expect(mockUpdateSubdomain).toHaveBeenCalledWith("sub-1", {
        targetIp: "9.9.9.9",
        targetIpv6: undefined,
      });
      expect(result.current.errorMessage).toBeNull();
      expect(result.current.isSubmitting).toBe(false);
    });

    it("sets errorMessage on update failure", async () => {
      mockUpdateSubdomain.mockRejectedValue(new Error("fail"));
      const { result } = renderEdit();
      act(() => result.current.setTargetIp("9.9.9.9"));

      await act(async () => {
        await result.current.handleSubmit({
          preventDefault: vi.fn(),
        } as never);
      });

      expect(result.current.errorMessage).toBe("domainDetail.updateError");
    });
  });

  describe("create mode (domainId === 'new')", () => {
    function renderCreate(tier: "FREE" | "PLUS" = "FREE") {
      (mockAuthInfo as { userTier: string }).userTier = tier;
      return renderHook(() => useDomainDetailLogic("new"), {
        wrapper: makeWrapper(),
      });
    }

    it("is in create mode", () => {
      const { result } = renderCreate();
      expect(result.current.isCreateMode).toBe(true);
      expect(result.current.isPlus).toBe(false);
    });

    it("canSubmit requires a valid IP", () => {
      const { result } = renderCreate();
      expect(result.current.canSubmit).toBe(false);
      act(() => result.current.setTargetIp("1.2.3.4"));
      expect(result.current.canSubmit).toBe(true);
    });

    it("handleSubmit in random mode creates subdomain with empty label", async () => {
      mockCreateSubdomain.mockResolvedValue({ uuid: "new-sub" });
      const { result } = renderCreate();
      act(() => result.current.setTargetIp("1.2.3.4"));

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() } as never);
      });

      expect(mockCreateSubdomain).toHaveBeenCalledWith({
        label: "",
        targetIp: "1.2.3.4",
        targetIpv6: undefined,
      });
      expect(mockNavigate).toHaveBeenCalledWith({
        to: "/domain/$domainId",
        params: { domainId: "new-sub" },
      });
    });

    it("navigates to dashboard when created subdomain has no uuid", async () => {
      mockCreateSubdomain.mockResolvedValue({});
      const { result } = renderCreate();
      act(() => result.current.setTargetIp("1.2.3.4"));

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() } as never);
      });

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/dashboard" });
    });

    it("sets errorMessage on create failure", async () => {
      mockCreateSubdomain.mockRejectedValue(new Error("fail"));
      const { result } = renderCreate();
      act(() => result.current.setTargetIp("1.2.3.4"));

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() } as never);
      });

      expect(result.current.errorMessage).toBe("createSubdomain.error");
    });

    it("PLUS user in custom mode checks label availability", async () => {
      vi.useFakeTimers();
      vi.mocked(checkLabelAvailability).mockResolvedValue({
        available: true,
        reason: null,
      });
      const { result } = renderCreate("PLUS");

      act(() => result.current.setNamingMode("custom"));
      act(() => result.current.setLabel("mysite"));

      expect(result.current.labelAvailability).toBe("checking");

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      expect(checkLabelAvailability).toHaveBeenCalledWith("mysite");
      expect(result.current.labelAvailability).toBe("available");
      vi.useRealTimers();
    });

    it("sets labelAvailability to taken when label is unavailable", async () => {
      vi.useFakeTimers();
      vi.mocked(checkLabelAvailability).mockResolvedValue({
        available: false,
        reason: "taken",
      });
      const { result } = renderCreate("PLUS");

      act(() => result.current.setNamingMode("custom"));
      act(() => result.current.setLabel("taken-label"));

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      expect(result.current.labelAvailability).toBe("taken");
      vi.useRealTimers();
    });

    it("sets labelAvailability to reserved when label is reserved", async () => {
      vi.useFakeTimers();
      vi.mocked(checkLabelAvailability).mockResolvedValue({
        available: false,
        reason: "reserved",
      });
      const { result } = renderCreate("PLUS");

      act(() => result.current.setNamingMode("custom"));
      act(() => result.current.setLabel("admin-label"));

      await act(async () => {
        await vi.runAllTimersAsync();
      });

      expect(result.current.labelAvailability).toBe("reserved");
      vi.useRealTimers();
    });
  });

  describe("handleDelete", () => {
    it("does nothing when confirm returns false", async () => {
      vi.stubGlobal("confirm", vi.fn().mockReturnValue(false));
      const { result } = renderHook(() => useDomainDetailLogic("sub-1"), {
        wrapper: makeWrapper({
          subdomains: { items: [baseSub], state: "idle", error: null },
        }),
      });

      await act(async () => {
        await result.current.handleDelete();
      });

      expect(mockDeleteSubdomain).not.toHaveBeenCalled();
    });

    it("deletes and navigates to dashboard", async () => {
      vi.stubGlobal("confirm", vi.fn().mockReturnValue(true));
      mockDeleteSubdomain.mockResolvedValue(undefined);
      const { result } = renderHook(() => useDomainDetailLogic("sub-1"), {
        wrapper: makeWrapper({
          subdomains: { items: [baseSub], state: "idle", error: null },
        }),
      });

      await act(async () => {
        await result.current.handleDelete();
      });

      expect(mockDeleteSubdomain).toHaveBeenCalledWith("sub-1");
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/dashboard" });
    });

    it("sets errorMessage on delete failure", async () => {
      vi.stubGlobal("confirm", vi.fn().mockReturnValue(true));
      mockDeleteSubdomain.mockRejectedValue(new Error("fail"));
      const { result } = renderHook(() => useDomainDetailLogic("sub-1"), {
        wrapper: makeWrapper({
          subdomains: { items: [baseSub], state: "idle", error: null },
        }),
      });

      await act(async () => {
        await result.current.handleDelete();
      });

      expect(result.current.errorMessage).toBe("domainDetail.deleteError");
      expect(result.current.isDeleting).toBe(false);
    });

    it("does nothing in create mode", async () => {
      vi.stubGlobal("confirm", vi.fn().mockReturnValue(true));
      const { result } = renderHook(() => useDomainDetailLogic("new"), {
        wrapper: makeWrapper(),
      });

      await act(async () => {
        await result.current.handleDelete();
      });

      expect(mockDeleteSubdomain).not.toHaveBeenCalled();
    });
  });

  describe("fetch mode (not in Redux cache)", () => {
    it("calls loadSubdomainByUuid when subdomain not in cache", async () => {
      mockLoadSubdomainByUuid.mockResolvedValue(baseSub);

      const { result } = renderHook(() => useDomainDetailLogic("sub-99"), {
        wrapper: makeWrapper({
          subdomains: { items: [], state: "idle", error: null },
        }),
      });

      await act(async () => {
        await new Promise((r) => setTimeout(r, 0));
      });

      expect(mockLoadSubdomainByUuid).toHaveBeenCalledWith("sub-99");
      expect(result.current.targetIp).toBe("1.2.3.4");
    });

    it("sets errorMessage when loadSubdomainByUuid returns null", async () => {
      mockLoadSubdomainByUuid.mockResolvedValue(null);

      const { result } = renderHook(() => useDomainDetailLogic("sub-99"), {
        wrapper: makeWrapper({
          subdomains: { items: [], state: "idle", error: null },
        }),
      });

      await act(async () => {
        await new Promise((r) => setTimeout(r, 0));
      });

      expect(result.current.errorMessage).toBe("domainDetail.loadError");
    });
  });

  describe("validation", () => {
    it("handleSubmit does not call update when IPs are empty", async () => {
      const sub = { ...baseSub, targetIp: null };
      const { result } = renderHook(() => useDomainDetailLogic("sub-1"), {
        wrapper: makeWrapper({
          subdomains: {
            items: [sub as SubdomainDto],
            state: "idle",
            error: null,
          },
        }),
      });

      act(() => result.current.setTargetIp(""));

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() } as never);
      });

      expect(mockUpdateSubdomain).not.toHaveBeenCalled();
    });

    it("ipv4Valid is false for invalid IP", () => {
      const { result } = renderHook(() => useDomainDetailLogic("new"), {
        wrapper: makeWrapper(),
      });
      act(() => result.current.setTargetIp("not-an-ip"));
      expect(result.current.ipv4Valid).toBe(false);
    });
  });
});
