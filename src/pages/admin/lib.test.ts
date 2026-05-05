import { beforeEach, describe, expect, it, vi } from "vitest";
import { adminApi } from "./lib";

function mockFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    status,
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(body),
  });
}

beforeEach(() => vi.clearAllMocks());

describe("adminApi", () => {
  describe("getSubdomains", () => {
    it("returns parsed body on success", async () => {
      const data = [{ uuid: "s1" }];
      vi.stubGlobal("fetch", mockFetch(200, data));

      const result = await adminApi.getSubdomains("key");

      expect(result).toEqual(data);
      vi.unstubAllGlobals();
    });

    it("throws UNAUTHORIZED on 401", async () => {
      vi.stubGlobal("fetch", mockFetch(401, {}));

      await expect(adminApi.getSubdomains("key")).rejects.toThrow(
        "UNAUTHORIZED",
      );
      vi.unstubAllGlobals();
    });

    it("throws HTTP error on non-ok status", async () => {
      vi.stubGlobal("fetch", mockFetch(500, {}));

      await expect(adminApi.getSubdomains("key")).rejects.toThrow("HTTP 500");
      vi.unstubAllGlobals();
    });
  });

  describe("getUsers", () => {
    it("returns users on success", async () => {
      const users = [{ uuid: "u1" }];
      vi.stubGlobal("fetch", mockFetch(200, users));

      const result = await adminApi.getUsers("key");

      expect(result).toEqual(users);
      vi.unstubAllGlobals();
    });
  });

  describe("getUserDetail", () => {
    it("fetches user detail by uuid", async () => {
      const detail = { uuid: "u1", username: "alice" };
      vi.stubGlobal("fetch", mockFetch(200, detail));

      const result = await adminApi.getUserDetail("key", "u1");

      expect(result).toEqual(detail);
      vi.unstubAllGlobals();
    });
  });

  describe("updateUser", () => {
    it("sends PATCH and returns updated user", async () => {
      const updated = { uuid: "u1", username: "alice2" };
      const fetchMock = mockFetch(200, updated);
      vi.stubGlobal("fetch", fetchMock);

      const result = await adminApi.updateUser("key", "u1", {
        username: "alice2",
      });

      expect(result).toEqual(updated);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/users/u1"),
        expect.objectContaining({ method: "PATCH" }),
      );
      vi.unstubAllGlobals();
    });
  });

  describe("deleteUser", () => {
    it("sends DELETE without returning a body", async () => {
      const fetchMock = mockFetch(204, null);
      vi.stubGlobal("fetch", fetchMock);

      await expect(adminApi.deleteUser("key", "u1")).resolves.toBeUndefined();
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/users/u1"),
        expect.objectContaining({ method: "DELETE" }),
      );
      vi.unstubAllGlobals();
    });

    it("throws on 401", async () => {
      vi.stubGlobal("fetch", mockFetch(401, {}));
      await expect(adminApi.deleteUser("key", "u1")).rejects.toThrow(
        "UNAUTHORIZED",
      );
      vi.unstubAllGlobals();
    });
  });

  describe("setMaxSubdomainOverride", () => {
    it("sends PATCH with override value", async () => {
      const fetchMock = mockFetch(200, {});
      vi.stubGlobal("fetch", fetchMock);

      await adminApi.setMaxSubdomainOverride("key", "u1", 5);

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/users/u1/max-subdomain-override"),
        expect.objectContaining({ method: "PATCH" }),
      );
      vi.unstubAllGlobals();
    });
  });

  describe("getSubdomainDetail", () => {
    it("returns subdomain detail", async () => {
      const sub = { uuid: "s1" };
      vi.stubGlobal("fetch", mockFetch(200, sub));

      const result = await adminApi.getSubdomainDetail("key", "s1");

      expect(result).toEqual(sub);
      vi.unstubAllGlobals();
    });
  });

  describe("updateSubdomainIps", () => {
    it("sends PUT with IP body", async () => {
      const updated = { uuid: "s1", targetIp: "5.6.7.8" };
      const fetchMock = mockFetch(200, updated);
      vi.stubGlobal("fetch", fetchMock);

      const result = await adminApi.updateSubdomainIps("key", "s1", {
        targetIp: "5.6.7.8",
      });

      expect(result).toEqual(updated);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/subdomains/s1"),
        expect.objectContaining({ method: "PUT" }),
      );
      vi.unstubAllGlobals();
    });
  });

  describe("relabelSubdomain", () => {
    it("sends PATCH with label body", async () => {
      const fetchMock = mockFetch(200, { uuid: "s1", label: "new" });
      vi.stubGlobal("fetch", fetchMock);

      await adminApi.relabelSubdomain("key", "s1", "new");

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/subdomains/s1/label"),
        expect.objectContaining({ method: "PATCH" }),
      );
      vi.unstubAllGlobals();
    });
  });

  describe("deleteSubdomain", () => {
    it("sends DELETE", async () => {
      const fetchMock = mockFetch(204, null);
      vi.stubGlobal("fetch", fetchMock);

      await adminApi.deleteSubdomain("key", "s1");

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/subdomains/s1"),
        expect.objectContaining({ method: "DELETE" }),
      );
      vi.unstubAllGlobals();
    });
  });

  describe("getSettings", () => {
    it("returns settings", async () => {
      vi.stubGlobal("fetch", mockFetch(200, { domainCreationEnabled: true }));

      const result = await adminApi.getSettings("key");

      expect(result).toEqual({ domainCreationEnabled: true });
      vi.unstubAllGlobals();
    });
  });

  describe("updateSettings", () => {
    it("sends PATCH with settings body", async () => {
      const fetchMock = mockFetch(200, { domainCreationEnabled: false });
      vi.stubGlobal("fetch", fetchMock);

      const result = await adminApi.updateSettings("key", {
        domainCreationEnabled: false,
      });

      expect(result).toEqual({ domainCreationEnabled: false });
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/settings"),
        expect.objectContaining({ method: "PATCH" }),
      );
      vi.unstubAllGlobals();
    });
  });
});
