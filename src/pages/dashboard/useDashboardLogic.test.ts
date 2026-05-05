import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SubdomainDto } from "@/api/generated/model";

import { makeWrapper } from "@/test/store-utils";
import { useDashboardLogic } from "./useDashboardLogic";

vi.mock("@/hooks/useAuthInformation/useAuthInformation", () => ({
  default: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

import useAuthInformation from "@/hooks/useAuthInformation/useAuthInformation";

const sub = (uuid: string): SubdomainDto => ({
  uuid,
  label: uuid,
  targetIp: "1.2.3.4",
  status: "ACTIVE",
  createdAt: "2024-01-01T00:00:00Z",
});

function mockAuth(
  overrides: Partial<ReturnType<typeof useAuthInformation>> = {},
) {
  vi.mocked(useAuthInformation).mockReturnValue({
    isVerified: true,
    isMfaEnabled: true,
    userTier: "FREE",
    maxSubdomainCount: 3,
    ...overrides,
  } as ReturnType<typeof useAuthInformation>);
}

beforeEach(() => {
  vi.clearAllMocks();
  mockNavigate.mockResolvedValue(undefined);
  mockAuth();
});

describe("useDashboardLogic", () => {
  it("reads subdomains and loading state from the store", () => {
    const { result } = renderHook(() => useDashboardLogic(), {
      wrapper: makeWrapper({
        subdomains: {
          items: [sub("a"), sub("b")],
          state: "loading",
          errorMessage: null,
        },
      }),
    });

    expect(result.current.subdomains).toHaveLength(2);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
  });

  it("reports isError when subdomains state is failed", () => {
    const { result } = renderHook(() => useDashboardLogic(), {
      wrapper: makeWrapper({
        subdomains: { items: [], state: "failed", errorMessage: "oops" },
      }),
    });

    expect(result.current.isError).toBe(true);
  });

  it("reports isSlotsExhausted when subdomain count equals maxSubdomainCount", () => {
    mockAuth({ isVerified: true, isMfaEnabled: true, maxSubdomainCount: 2 });

    const { result } = renderHook(() => useDashboardLogic(), {
      wrapper: makeWrapper({
        subdomains: {
          items: [sub("a"), sub("b")],
          state: "idle",
          errorMessage: null,
        },
      }),
    });

    expect(result.current.isSlotsExhausted).toBe(true);
  });

  it("reports isSlotsExhausted false when below the limit", () => {
    mockAuth({ isVerified: true, isMfaEnabled: true, maxSubdomainCount: 5 });

    const { result } = renderHook(() => useDashboardLogic(), {
      wrapper: makeWrapper({
        subdomains: { items: [sub("a")], state: "idle", errorMessage: null },
      }),
    });

    expect(result.current.isSlotsExhausted).toBe(false);
  });

  it("reads domainCreationEnabled from settings slice", () => {
    const { result } = renderHook(() => useDashboardLogic(), {
      wrapper: makeWrapper({
        settings: { domainCreationEnabled: false },
      }),
    });

    expect(result.current.domainCreationEnabled).toBe(false);
  });

  describe("handleCreateNew", () => {
    it("navigates to the new domain form when verified and MFA enabled", () => {
      mockAuth({ isVerified: true, isMfaEnabled: true });
      const { result } = renderHook(() => useDashboardLogic(), {
        wrapper: makeWrapper(),
      });

      act(() => result.current.handleCreateNew());

      expect(mockNavigate).toHaveBeenCalledWith({
        to: "/domain/$domainId",
        params: { domainId: "new" },
      });
    });

    it("navigates to /mfa-setup when verified but MFA not enabled", () => {
      mockAuth({ isVerified: true, isMfaEnabled: false });
      const { result } = renderHook(() => useDashboardLogic(), {
        wrapper: makeWrapper(),
      });

      act(() => result.current.handleCreateNew());

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/mfa-setup" });
    });

    it("navigates to /verify when not verified", () => {
      mockAuth({ isVerified: false, isMfaEnabled: false });
      const { result } = renderHook(() => useDashboardLogic(), {
        wrapper: makeWrapper(),
      });

      act(() => result.current.handleCreateNew());

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/verify" });
    });
  });
});
