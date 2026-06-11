import { describe, expect, it } from "vitest";
import { i18n } from "./config";

describe("i18n config", () => {
  it("initialises with English as the default language", () => {
    expect(i18n.language).toBe("en");
  });

  it("resolves keys from the bundled resources", () => {
    expect(i18n.t("nav.login")).not.toBe("nav.login");
  });

  it("falls back to English for unknown languages", () => {
    expect(i18n.options.fallbackLng).toEqual(["en"]);
  });
});
