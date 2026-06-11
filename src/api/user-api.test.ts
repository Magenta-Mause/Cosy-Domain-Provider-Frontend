import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockCustomInstance } = vi.hoisted(() => ({
  mockCustomInstance: vi.fn(),
}));

vi.mock("@/api/axios-instance", () => ({
  customInstance: mockCustomInstance,
  setIdentityToken: vi.fn(),
}));

import { getOAuthIdentities } from "./user-api";

beforeEach(() => vi.clearAllMocks());

describe("getOAuthIdentities", () => {
  it("fetches the linked identities", async () => {
    const identities = [{ provider: "github", email: "a@a.com" }];
    mockCustomInstance.mockResolvedValue(identities);

    const result = await getOAuthIdentities();

    expect(mockCustomInstance).toHaveBeenCalledWith({
      url: "/api/v1/user/oauth-identities",
      method: "GET",
    });
    expect(result).toEqual(identities);
  });
});
