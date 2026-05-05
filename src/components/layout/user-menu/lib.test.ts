import { describe, expect, it } from "vitest";
import { getUserInitial } from "./lib";

describe("getUserInitial", () => {
  it("returns the first character uppercased", () => {
    expect(getUserInitial("alice")).toBe("A");
    expect(getUserInitial("bob")).toBe("B");
  });

  it("handles already-uppercase names", () => {
    expect(getUserInitial("Alice")).toBe("A");
  });

  it("returns ? for null", () => {
    expect(getUserInitial(null)).toBe("?");
  });

  it("returns ? for undefined", () => {
    expect(getUserInitial(undefined)).toBe("?");
  });

  it("returns ? for an empty string", () => {
    expect(getUserInitial("")).toBe("?");
  });
});
