import type { AxiosRequestConfig } from "axios";
import { afterEach, describe, expect, it } from "vitest";

import {
  AXIOS_INSTANCE,
  customInstance,
  getIdentityToken,
  setIdentityToken,
} from "./axios-instance";

function withMockAdapter(): AxiosRequestConfig[] {
  const seen: AxiosRequestConfig[] = [];
  AXIOS_INSTANCE.defaults.adapter = (config) => {
    seen.push(config);
    return Promise.resolve({
      data: { ok: true },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    });
  };
  return seen;
}

afterEach(() => setIdentityToken(null));

describe("identity token", () => {
  it("stores and clears the token", () => {
    setIdentityToken("tok");
    expect(getIdentityToken()).toBe("tok");
    setIdentityToken(null);
    expect(getIdentityToken()).toBeNull();
  });
});

describe("customInstance", () => {
  it("resolves with the response data", async () => {
    withMockAdapter();
    const result = await customInstance<{ ok: boolean }>({
      url: "/api/test",
      method: "GET",
    });
    expect(result).toEqual({ ok: true });
  });

  it("attaches the bearer token when set", async () => {
    const seen = withMockAdapter();
    setIdentityToken("tok-123");

    await customInstance({ url: "/api/test", method: "GET" });

    expect(seen[0].headers?.Authorization).toBe("Bearer tok-123");
  });

  it("sends no Authorization header without a token", async () => {
    const seen = withMockAdapter();

    await customInstance({ url: "/api/test", method: "GET" });

    expect(seen[0].headers?.Authorization).toBeUndefined();
  });

  it("exposes a cancel method for Orval", () => {
    withMockAdapter();
    const promise = customInstance({ url: "/api/test", method: "GET" });
    expect(typeof (promise as unknown as { cancel: () => void }).cancel).toBe(
      "function",
    );
  });
});
