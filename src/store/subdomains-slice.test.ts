import { describe, expect, it } from "vitest";
import type { SubdomainDto } from "@/api/generated/model";
import {
  type SubdomainsState,
  clearSubdomains,
  removeSubdomain,
  setSubdomains,
  setSubdomainsError,
  setSubdomainsState,
  subdomainsReducer,
  upsertSubdomain,
} from "./subdomains-slice";

const initialState: SubdomainsState = {
  items: [],
  state: "idle",
  errorMessage: null,
};

const sub = (uuid: string, label = "test"): SubdomainDto => ({
  uuid,
  label,
  ipv4Address: "1.2.3.4",
  ipv6Address: null,
  active: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
});

describe("subdomains reducer", () => {
  describe("setSubdomainsState", () => {
    it("updates the status field", () => {
      expect(
        subdomainsReducer(initialState, setSubdomainsState("loading")).state,
      ).toBe("loading");
      expect(
        subdomainsReducer(initialState, setSubdomainsState("failed")).state,
      ).toBe("failed");
    });
  });

  describe("setSubdomains", () => {
    it("replaces all items and clears errorMessage", () => {
      const dirty: SubdomainsState = {
        items: [sub("old")],
        state: "idle",
        errorMessage: "prev error",
      };
      const result = subdomainsReducer(dirty, setSubdomains([sub("a"), sub("b")]));
      expect(result.items).toHaveLength(2);
      expect(result.items[0].uuid).toBe("a");
      expect(result.errorMessage).toBeNull();
    });

    it("accepts an empty array", () => {
      const state = subdomainsReducer(
        { ...initialState, items: [sub("x")] },
        setSubdomains([]),
      );
      expect(state.items).toHaveLength(0);
    });
  });

  describe("upsertSubdomain", () => {
    it("prepends when uuid is absent", () => {
      const existing = { ...initialState, items: [sub("a")] };
      const noUuid: SubdomainDto = { ...sub(""), uuid: undefined };
      const result = subdomainsReducer(existing, upsertSubdomain(noUuid));
      expect(result.items[0]).toEqual(noUuid);
      expect(result.items).toHaveLength(2);
    });

    it("prepends when uuid is not found in the list", () => {
      const existing = { ...initialState, items: [sub("a")] };
      const result = subdomainsReducer(existing, upsertSubdomain(sub("b")));
      expect(result.items[0].uuid).toBe("b");
      expect(result.items).toHaveLength(2);
    });

    it("updates in place when uuid already exists", () => {
      const updated = sub("a", "updated-label");
      const existing = { ...initialState, items: [sub("a", "old"), sub("b")] };
      const result = subdomainsReducer(existing, upsertSubdomain(updated));
      expect(result.items).toHaveLength(2);
      expect(result.items[0].label).toBe("updated-label");
    });
  });

  describe("removeSubdomain", () => {
    it("removes the item with the given uuid", () => {
      const state = { ...initialState, items: [sub("a"), sub("b"), sub("c")] };
      const result = subdomainsReducer(state, removeSubdomain("b"));
      expect(result.items.map((i) => i.uuid)).toEqual(["a", "c"]);
    });

    it("is a no-op when uuid is not found", () => {
      const state = { ...initialState, items: [sub("a")] };
      const result = subdomainsReducer(state, removeSubdomain("z"));
      expect(result.items).toHaveLength(1);
    });
  });

  describe("clearSubdomains", () => {
    it("resets items, state, and errorMessage", () => {
      const dirty: SubdomainsState = {
        items: [sub("a")],
        state: "failed",
        errorMessage: "oops",
      };
      const result = subdomainsReducer(dirty, clearSubdomains());
      expect(result.items).toHaveLength(0);
      expect(result.state).toBe("idle");
      expect(result.errorMessage).toBeNull();
    });
  });

  describe("setSubdomainsError", () => {
    it("sets the error message", () => {
      const result = subdomainsReducer(
        initialState,
        setSubdomainsError("something went wrong"),
      );
      expect(result.errorMessage).toBe("something went wrong");
    });

    it("accepts null to clear the error", () => {
      const state = { ...initialState, errorMessage: "oops" };
      const result = subdomainsReducer(state, setSubdomainsError(null));
      expect(result.errorMessage).toBeNull();
    });
  });
});
