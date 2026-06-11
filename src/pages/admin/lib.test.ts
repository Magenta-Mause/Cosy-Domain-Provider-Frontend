import { beforeEach, describe, expect, it } from "vitest";
import {
  ADMIN_KEY_STORAGE,
  getStoredAdminKey,
  subdomainStatusColor,
} from "./lib";

beforeEach(() => sessionStorage.clear());

describe("getStoredAdminKey", () => {
  it("returns the stored key", () => {
    sessionStorage.setItem(ADMIN_KEY_STORAGE, "secret");
    expect(getStoredAdminKey()).toBe("secret");
  });

  it("returns an empty string when no key is stored", () => {
    expect(getStoredAdminKey()).toBe("");
  });
});

describe("subdomainStatusColor", () => {
  it("maps ACTIVE to green", () => {
    expect(subdomainStatusColor("ACTIVE")).toBe("text-green-600");
  });

  it("maps FAILED to destructive", () => {
    expect(subdomainStatusColor("FAILED")).toBe("text-destructive");
  });

  it("maps PENDING to yellow", () => {
    expect(subdomainStatusColor("PENDING")).toBe("text-yellow-400");
  });
});
