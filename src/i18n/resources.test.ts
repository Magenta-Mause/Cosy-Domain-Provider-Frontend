import { describe, expect, it } from "vitest";
import { resources } from "./resources";

function flattenKeys(obj: object, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([key, value]) =>
    typeof value === "object" && value !== null
      ? flattenKeys(value, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  );
}

describe("i18n resources", () => {
  it("en and de declare exactly the same keys", () => {
    const enKeys = flattenKeys(resources.en).sort();
    const deKeys = flattenKeys(resources.de).sort();
    expect(deKeys).toEqual(enKeys);
  });
});
