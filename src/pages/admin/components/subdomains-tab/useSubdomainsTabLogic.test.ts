import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useSubdomainsTabLogic } from "./useSubdomainsTabLogic";

vi.mock("../../lib", () => ({
  adminApi: { getSubdomains: vi.fn() },
}));

const mockT = (key: string) => key;
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: mockT }),
}));

const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

import { adminApi } from "../../lib";

beforeEach(() => {
  vi.clearAllMocks();
  mockNavigate.mockResolvedValue(undefined);
});

function makeSubdomain(uuid: string, status: "ACTIVE" | "FAILED" | "PENDING" = "ACTIVE") {
  return { uuid, label: uuid, fqdn: null, targetIp: null, targetIpv6: null, status, labelMode: "CUSTOM", ownerUuid: "u1", ownerUsername: "alice", ownerEmail: "a@b.com", createdAt: "", updatedAt: "" } as const;
}

describe("useSubdomainsTabLogic", () => {
  it("loads subdomains on mount and sets isLoading false", async () => {
    const subs = [makeSubdomain("a"), makeSubdomain("b", "FAILED")];
    vi.mocked(adminApi.getSubdomains).mockResolvedValue([...subs]);

    const { result } = renderHook(() => useSubdomainsTabLogic("admin-key"));

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(adminApi.getSubdomains).toHaveBeenCalledWith("admin-key");
    expect(result.current.subdomains).toHaveLength(2);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("computes total and failed counts", async () => {
    vi.mocked(adminApi.getSubdomains).mockResolvedValue([
      makeSubdomain("a"),
      makeSubdomain("b", "FAILED"),
      makeSubdomain("c", "FAILED"),
    ]);

    const { result } = renderHook(() => useSubdomainsTabLogic("key"));

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.total).toBe(3);
    expect(result.current.failed).toBe(2);
  });

  it("sets error when loading fails", async () => {
    vi.mocked(adminApi.getSubdomains).mockRejectedValue(new Error("fail"));

    const { result } = renderHook(() => useSubdomainsTabLogic("key"));

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.error).toBe("admin.loadSubdomainsError");
    expect(result.current.isLoading).toBe(false);
  });

  it("handleSubdomainClick navigates to the subdomain detail page", () => {
    vi.mocked(adminApi.getSubdomains).mockResolvedValue([]);
    const { result } = renderHook(() => useSubdomainsTabLogic("key"));

    act(() => result.current.handleSubdomainClick("sub-uuid"));

    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/admin/subdomains/$subdomainId",
      params: { subdomainId: "sub-uuid" },
    });
  });
});
