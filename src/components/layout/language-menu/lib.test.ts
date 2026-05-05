import { describe, expect, it } from "vitest";
import { getLanguageCode } from "./lib";

describe("getLanguageCode", () => {
  it("returns DE for 'de'", () => {
    expect(getLanguageCode("de")).toBe("DE");
  });

  it("returns DE for 'de-DE' locale strings", () => {
    expect(getLanguageCode("de-DE")).toBe("DE");
  });

  it("returns EN for 'en'", () => {
    expect(getLanguageCode("en")).toBe("EN");
  });

  it("returns EN for any non-German language", () => {
    expect(getLanguageCode("fr")).toBe("EN");
    expect(getLanguageCode("es")).toBe("EN");
    expect(getLanguageCode("ja")).toBe("EN");
  });

  it("is case-insensitive", () => {
    expect(getLanguageCode("DE")).toBe("DE");
    expect(getLanguageCode("De-AT")).toBe("DE");
  });
});
