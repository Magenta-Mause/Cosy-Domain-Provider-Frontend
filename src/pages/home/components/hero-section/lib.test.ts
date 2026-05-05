import { describe, expect, it } from "vitest";
import { sanitizeSubdomainInput } from "./lib";

describe("sanitizeSubdomainInput", () => {
  it("lowercases all characters", () => {
    expect(sanitizeSubdomainInput("MyDomain")).toBe("mydomain");
  });

  it("removes characters that are not letters, digits, or hyphens", () => {
    expect(sanitizeSubdomainInput("my_domain!")).toBe("mydomain");
    expect(sanitizeSubdomainInput("my domain")).toBe("mydomain");
  });

  it("preserves hyphens", () => {
    expect(sanitizeSubdomainInput("my-domain")).toBe("my-domain");
  });

  it("returns empty string for empty input", () => {
    expect(sanitizeSubdomainInput("")).toBe("");
  });

  it("handles mixed cases and special chars together", () => {
    expect(sanitizeSubdomainInput("Hello World!123")).toBe("helloworld123");
  });
});
