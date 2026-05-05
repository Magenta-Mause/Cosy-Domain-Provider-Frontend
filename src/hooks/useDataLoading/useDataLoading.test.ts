import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeWrapper } from "@/test/store-utils";

vi.mock("@/api/generated/domain-provider-api", () => ({
  fetchToken: vi.fn(),
  listMySubdomains: vi.fn(),
  getSubdomain: vi.fn(),
}));

vi.mock("@/api/axios-instance", () => ({
  setIdentityToken: vi.fn(),
}));

vi.mock("@/lib/jwt", () => ({
  parseIdentityToken: vi.fn(),
}));

import { setIdentityToken } from "@/api/axios-instance";
import {
  fetchToken,
  getSubdomain,
  listMySubdomains,
} from "@/api/generated/domain-provider-api";
import { parseIdentityToken } from "@/lib/jwt";
import useDataLoading from "./useDataLoading";

beforeEach(() => vi.clearAllMocks());

describe("useDataLoading", () => {
  describe("loadSubdomains", () => {
    it("dispatches subdomains on success", async () => {
      const subs = [{ uuid: "s1" }, { uuid: "s2" }];
      vi.mocked(listMySubdomains).mockResolvedValue(subs as never);

      const { result } = renderHook(() => useDataLoading(), {
        wrapper: makeWrapper(),
      });

      let returned: unknown;
      await act(async () => {
        returned = await result.current.loadSubdomains();
      });

      expect(listMySubdomains).toHaveBeenCalledOnce();
      expect(returned).toEqual(subs);
    });

    it("returns null on failure", async () => {
      vi.mocked(listMySubdomains).mockRejectedValue(new Error("fail"));

      const { result } = renderHook(() => useDataLoading(), {
        wrapper: makeWrapper(),
      });

      let returned: unknown;
      await act(async () => {
        returned = await result.current.loadSubdomains();
      });

      expect(returned).toBeNull();
    });
  });

  describe("bootstrapAuth", () => {
    it("sets identity and returns true on success", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          json: () => Promise.resolve({ domainCreationEnabled: true }),
        }),
      );
      vi.mocked(fetchToken).mockResolvedValue("tok");
      vi.mocked(parseIdentityToken).mockReturnValue({ sub: "u1" } as never);
      vi.mocked(listMySubdomains).mockResolvedValue([]);

      const { result } = renderHook(() => useDataLoading(), {
        wrapper: makeWrapper(),
      });

      let returned: unknown;
      await act(async () => {
        returned = await result.current.bootstrapAuth();
      });

      expect(setIdentityToken).toHaveBeenCalledWith("tok");
      expect(returned).toBe(true);
      vi.unstubAllGlobals();
    });

    it("returns false when fetchToken throws", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          json: () => Promise.resolve({ domainCreationEnabled: true }),
        }),
      );
      vi.mocked(fetchToken).mockRejectedValue(new Error("401"));
      vi.mocked(listMySubdomains).mockResolvedValue([]);

      const { result } = renderHook(() => useDataLoading(), {
        wrapper: makeWrapper(),
      });

      let returned: unknown;
      await act(async () => {
        returned = await result.current.bootstrapAuth();
      });

      expect(setIdentityToken).toHaveBeenCalledWith(null);
      expect(returned).toBe(false);
      vi.unstubAllGlobals();
    });
  });

  describe("loadSubdomainByUuid", () => {
    it("upserts and returns the subdomain on success", async () => {
      const sub = { uuid: "s1", label: "test" };
      vi.mocked(getSubdomain).mockResolvedValue(sub as never);

      const { result } = renderHook(() => useDataLoading(), {
        wrapper: makeWrapper(),
      });

      let returned: unknown;
      await act(async () => {
        returned = await result.current.loadSubdomainByUuid("s1");
      });

      expect(getSubdomain).toHaveBeenCalledWith("s1");
      expect(returned).toEqual(sub);
    });

    it("returns null on failure", async () => {
      vi.mocked(getSubdomain).mockRejectedValue(new Error("404"));

      const { result } = renderHook(() => useDataLoading(), {
        wrapper: makeWrapper(),
      });

      let returned: unknown;
      await act(async () => {
        returned = await result.current.loadSubdomainByUuid("s1");
      });

      expect(returned).toBeNull();
    });
  });
});
