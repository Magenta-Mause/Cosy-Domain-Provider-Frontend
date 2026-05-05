import { describe, expect, it } from "vitest";
import { formatCreatedAt, getLocale } from "./lib";

describe("getLocale", () => {
  it("returns de-DE for German language codes", () => {
    expect(getLocale("de")).toBe("de-DE");
    expect(getLocale("de-DE")).toBe("de-DE");
    expect(getLocale("de-AT")).toBe("de-DE");
  });

  it("returns en-US for non-German language codes", () => {
    expect(getLocale("en")).toBe("en-US");
    expect(getLocale("fr")).toBe("en-US");
  });

  it("is case-insensitive", () => {
    expect(getLocale("DE")).toBe("de-DE");
    expect(getLocale("DE-CH")).toBe("de-DE");
  });
});

describe("formatCreatedAt", () => {
  it("returns the fallback when createdAt is undefined", () => {
    expect(formatCreatedAt(undefined, "en-US", "—")).toBe("—");
  });

  it("returns the fallback when createdAt is empty string", () => {
    expect(formatCreatedAt("", "en-US", "—")).toBe("—");
  });

  it("formats a valid ISO date string", () => {
    const result = formatCreatedAt("2024-06-15T10:30:00Z", "en-US", "—");
    expect(result).toContain("2024");
    expect(result).not.toBe("—");
  });

  it("respects the locale for German formatting", () => {
    const en = formatCreatedAt("2024-06-15T10:30:00Z", "en-US", "—");
    const de = formatCreatedAt("2024-06-15T10:30:00Z", "de-DE", "—");
    // Different locales produce different strings
    expect(de).not.toBe(en);
  });
});
