import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockChangeLanguage = vi.fn();
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ i18n: { changeLanguage: mockChangeLanguage } }),
}));

const mockLocalStorage = { setItem: vi.fn(), getItem: vi.fn(), removeItem: vi.fn() };

beforeEach(() => {
  vi.clearAllMocks();
  mockChangeLanguage.mockResolvedValue(undefined);
  vi.stubGlobal("localStorage", mockLocalStorage);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

import { useLanguageChange } from "./useLanguageChange";

describe("useLanguageChange", () => {
  it("calls i18n.changeLanguage with the given language", async () => {
    const { result } = renderHook(() => useLanguageChange());

    await act(async () => {
      await result.current.handleLanguageChange("de");
    });

    expect(mockChangeLanguage).toHaveBeenCalledWith("de");
  });

  it("persists the language to localStorage", async () => {
    const { result } = renderHook(() => useLanguageChange());

    await act(async () => {
      await result.current.handleLanguageChange("en");
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith("cosy-language", "en");
  });

  it("works with 'de' language", async () => {
    const { result } = renderHook(() => useLanguageChange());

    await act(async () => {
      await result.current.handleLanguageChange("de");
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith("cosy-language", "de");
  });
});
