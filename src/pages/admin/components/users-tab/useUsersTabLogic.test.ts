import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useUsersTabLogic } from "./useUsersTabLogic";

vi.mock("../../lib", () => ({
  adminApi: { getUsers: vi.fn() },
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

function makeUser(
  uuid: string,
  tier: "FREE" | "PLUS" = "FREE",
  verified = true,
) {
  return {
    uuid,
    username: uuid,
    email: `${uuid}@x.com`,
    verified,
    tier,
    maxSubdomainCount: 3,
    maxSubdomainCountOverride: null,
    subdomainCount: 0,
    planExpiresAt: null,
    createdAt: null,
  };
}

describe("useUsersTabLogic", () => {
  it("loads users on mount", async () => {
    vi.mocked(adminApi.getUsers).mockResolvedValue([
      makeUser("u1"),
      makeUser("u2"),
    ]);
    const { result } = renderHook(() => useUsersTabLogic("key"));

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.users).toHaveLength(2);
    expect(result.current.isLoading).toBe(false);
  });

  it("computes total, unverified, and plus counts", async () => {
    vi.mocked(adminApi.getUsers).mockResolvedValue([
      makeUser("u1", "FREE", false),
      makeUser("u2", "PLUS", true),
      makeUser("u3", "FREE", false),
    ]);

    const { result } = renderHook(() => useUsersTabLogic("key"));

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.total).toBe(3);
    expect(result.current.unverified).toBe(2);
    expect(result.current.plus).toBe(1);
  });

  it("sets error when loading fails", async () => {
    vi.mocked(adminApi.getUsers).mockRejectedValue(new Error("fail"));
    const { result } = renderHook(() => useUsersTabLogic("key"));

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.error).toBe("admin.loadUsersError");
    expect(result.current.isLoading).toBe(false);
  });

  it("handleUserClick navigates to the user detail page", () => {
    vi.mocked(adminApi.getUsers).mockResolvedValue([]);
    const { result } = renderHook(() => useUsersTabLogic("key"));

    act(() => result.current.handleUserClick("user-uuid"));

    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/admin/users/$userId",
      params: { userId: "user-uuid" },
    });
  });
});
