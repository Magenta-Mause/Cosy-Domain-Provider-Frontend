import { describe, expect, it } from "vitest";
import { setDomainCreationEnabled, settingsReducer } from "./settings-slice";

describe("settings reducer", () => {
  it("starts with domainCreationEnabled: true", () => {
    const state = settingsReducer(undefined, { type: "@@INIT" });
    expect(state.domainCreationEnabled).toBe(true);
  });

  it("disables domain creation", () => {
    const result = settingsReducer(undefined, setDomainCreationEnabled(false));
    expect(result.domainCreationEnabled).toBe(false);
  });

  it("re-enables domain creation", () => {
    const disabled = settingsReducer(undefined, setDomainCreationEnabled(false));
    const result = settingsReducer(disabled, setDomainCreationEnabled(true));
    expect(result.domainCreationEnabled).toBe(true);
  });
});
