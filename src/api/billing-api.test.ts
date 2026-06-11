import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockCustomInstance } = vi.hoisted(() => ({
  mockCustomInstance: vi.fn(),
}));

vi.mock("@/api/axios-instance", () => ({
  customInstance: mockCustomInstance,
  setIdentityToken: vi.fn(),
}));

import { getBillingPortalUrl, getCheckoutUrl } from "./billing-api";

beforeEach(() => vi.clearAllMocks());

describe("billing-api", () => {
  it("getBillingPortalUrl fetches the portal URL", async () => {
    mockCustomInstance.mockResolvedValue({ url: "https://portal" });

    const result = await getBillingPortalUrl();

    expect(mockCustomInstance).toHaveBeenCalledWith({
      url: "/api/v1/billing/portal",
      method: "GET",
    });
    expect(result).toEqual({ url: "https://portal" });
  });

  it("getCheckoutUrl posts to the checkout endpoint", async () => {
    mockCustomInstance.mockResolvedValue({ url: "https://checkout" });

    const result = await getCheckoutUrl();

    expect(mockCustomInstance).toHaveBeenCalledWith({
      url: "/api/v1/billing/checkout",
      method: "POST",
    });
    expect(result).toEqual({ url: "https://checkout" });
  });
});
