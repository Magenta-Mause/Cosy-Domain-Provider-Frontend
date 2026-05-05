import { describe, expect, it } from "vitest";
import { sanitizeVerificationCode } from "./lib";

describe("sanitizeVerificationCode", () => {
  it("removes spaces", () => {
    expect(sanitizeVerificationCode("ABC 123")).toBe("ABC123");
  });

  it("removes hyphens", () => {
    expect(sanitizeVerificationCode("ABC-123")).toBe("ABC123");
  });

  it("removes both spaces and hyphens", () => {
    expect(sanitizeVerificationCode("A B-C 1-2 3")).toBe("ABC123");
  });

  it("returns the code unchanged when there are no spaces or hyphens", () => {
    expect(sanitizeVerificationCode("ABCDEF")).toBe("ABCDEF");
  });

  it("returns empty string for empty input", () => {
    expect(sanitizeVerificationCode("")).toBe("");
  });
});
