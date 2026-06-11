import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockCustomInstance } = vi.hoisted(() => ({
  mockCustomInstance: vi.fn(),
}));

vi.mock("@/api/axios-instance", () => ({
  customInstance: mockCustomInstance,
  setIdentityToken: vi.fn(),
}));

import { checkLabelAvailability } from "./subdomain-api";

beforeEach(() => vi.clearAllMocks());

describe("checkLabelAvailability", () => {
  it("queries the check endpoint with the label", async () => {
    mockCustomInstance.mockResolvedValue({ available: true, reason: null });

    const result = await checkLabelAvailability("castle");

    expect(mockCustomInstance).toHaveBeenCalledWith({
      url: "/api/v1/subdomain/check",
      method: "GET",
      params: { label: "castle" },
    });
    expect(result).toEqual({ available: true, reason: null });
  });

  it("propagates the unavailable reason", async () => {
    mockCustomInstance.mockResolvedValue({
      available: false,
      reason: "reserved",
    });

    const result = await checkLabelAvailability("admin");

    expect(result).toEqual({ available: false, reason: "reserved" });
  });
});
