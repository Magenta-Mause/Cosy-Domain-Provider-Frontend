import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockCustomInstance } = vi.hoisted(() => ({
  mockCustomInstance: vi.fn(),
}));

vi.mock("@/api/axios-instance", () => ({
  customInstance: mockCustomInstance,
  setIdentityToken: vi.fn(),
}));

import { adminApi } from "./admin-api";

function axiosError(status: number) {
  return { isAxiosError: true, response: { status } };
}

beforeEach(() => vi.clearAllMocks());

describe("adminApi", () => {
  describe("getSubdomains", () => {
    it("returns parsed body on success", async () => {
      const data = [{ uuid: "s1" }];
      mockCustomInstance.mockResolvedValue(data);

      const result = await adminApi.getSubdomains("key");

      expect(result).toEqual(data);
      expect(mockCustomInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining("/subdomains"),
          headers: { "X-Admin-Key": "key" },
        }),
      );
    });

    it("throws UNAUTHORIZED on 401", async () => {
      mockCustomInstance.mockRejectedValue(axiosError(401));

      await expect(adminApi.getSubdomains("key")).rejects.toThrow(
        "UNAUTHORIZED",
      );
    });

    it("throws HTTP error on non-ok status", async () => {
      mockCustomInstance.mockRejectedValue(axiosError(500));

      await expect(adminApi.getSubdomains("key")).rejects.toThrow("HTTP 500");
    });
  });

  describe("getUsers", () => {
    it("returns users on success", async () => {
      const users = [{ uuid: "u1" }];
      mockCustomInstance.mockResolvedValue(users);

      const result = await adminApi.getUsers("key");

      expect(result).toEqual(users);
    });
  });

  describe("getUserDetail", () => {
    it("fetches user detail by uuid", async () => {
      const detail = { uuid: "u1", username: "alice" };
      mockCustomInstance.mockResolvedValue(detail);

      const result = await adminApi.getUserDetail("key", "u1");

      expect(result).toEqual(detail);
      expect(mockCustomInstance).toHaveBeenCalledWith(
        expect.objectContaining({ url: expect.stringContaining("/users/u1") }),
      );
    });
  });

  describe("updateUser", () => {
    it("sends PATCH and returns updated user", async () => {
      const updated = { uuid: "u1", username: "alice2" };
      mockCustomInstance.mockResolvedValue(updated);

      const result = await adminApi.updateUser("key", "u1", {
        username: "alice2",
      });

      expect(result).toEqual(updated);
      expect(mockCustomInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining("/users/u1"),
          method: "PATCH",
          data: { username: "alice2" },
        }),
      );
    });
  });

  describe("deleteUser", () => {
    it("sends DELETE", async () => {
      mockCustomInstance.mockResolvedValue(undefined);

      await expect(adminApi.deleteUser("key", "u1")).resolves.toBeUndefined();
      expect(mockCustomInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining("/users/u1"),
          method: "DELETE",
        }),
      );
    });

    it("throws on 401", async () => {
      mockCustomInstance.mockRejectedValue(axiosError(401));
      await expect(adminApi.deleteUser("key", "u1")).rejects.toThrow(
        "UNAUTHORIZED",
      );
    });
  });

  describe("setMaxSubdomainOverride", () => {
    it("sends PATCH with override value", async () => {
      mockCustomInstance.mockResolvedValue({});

      await adminApi.setMaxSubdomainOverride("key", "u1", 5);

      expect(mockCustomInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining("/users/u1/max-subdomain-override"),
          method: "PATCH",
          data: { maxSubdomainCountOverride: 5 },
        }),
      );
    });
  });

  describe("getSubdomainDetail", () => {
    it("returns subdomain detail", async () => {
      const sub = { uuid: "s1" };
      mockCustomInstance.mockResolvedValue(sub);

      const result = await adminApi.getSubdomainDetail("key", "s1");

      expect(result).toEqual(sub);
    });
  });

  describe("updateSubdomainIps", () => {
    it("sends PUT with IP body", async () => {
      const updated = { uuid: "s1", targetIp: "5.6.7.8" };
      mockCustomInstance.mockResolvedValue(updated);

      const result = await adminApi.updateSubdomainIps("key", "s1", {
        targetIp: "5.6.7.8",
      });

      expect(result).toEqual(updated);
      expect(mockCustomInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining("/subdomains/s1"),
          method: "PUT",
          data: { targetIp: "5.6.7.8" },
        }),
      );
    });
  });

  describe("relabelSubdomain", () => {
    it("sends PATCH with label body", async () => {
      mockCustomInstance.mockResolvedValue({ uuid: "s1", label: "new" });

      await adminApi.relabelSubdomain("key", "s1", "new");

      expect(mockCustomInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining("/subdomains/s1/label"),
          method: "PATCH",
          data: { label: "new" },
        }),
      );
    });
  });

  describe("deleteSubdomain", () => {
    it("sends DELETE", async () => {
      mockCustomInstance.mockResolvedValue(undefined);

      await adminApi.deleteSubdomain("key", "s1");

      expect(mockCustomInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining("/subdomains/s1"),
          method: "DELETE",
        }),
      );
    });
  });

  describe("getSettings", () => {
    it("returns settings", async () => {
      mockCustomInstance.mockResolvedValue({ domainCreationEnabled: true });

      const result = await adminApi.getSettings("key");

      expect(result).toEqual({ domainCreationEnabled: true });
    });
  });

  describe("updateSettings", () => {
    it("sends PATCH with settings body", async () => {
      mockCustomInstance.mockResolvedValue({ domainCreationEnabled: false });

      const result = await adminApi.updateSettings("key", {
        domainCreationEnabled: false,
      });

      expect(result).toEqual({ domainCreationEnabled: false });
      expect(mockCustomInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining("/settings"),
          method: "PATCH",
        }),
      );
    });
  });
});
