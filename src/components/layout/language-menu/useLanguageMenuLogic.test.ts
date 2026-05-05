import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLanguageMenuLogic } from "./useLanguageMenuLogic";

describe("useLanguageMenuLogic", () => {
  const onChangeLanguage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts with the menu closed", () => {
    const { result } = renderHook(() =>
      useLanguageMenuLogic(onChangeLanguage, "en"),
    );
    expect(result.current.menuOpen).toBe(false);
  });

  it("exposes setMenuOpen to open and close the menu", () => {
    const { result } = renderHook(() =>
      useLanguageMenuLogic(onChangeLanguage, "en"),
    );

    act(() => result.current.setMenuOpen(true));
    expect(result.current.menuOpen).toBe(true);

    act(() => result.current.setMenuOpen(false));
    expect(result.current.menuOpen).toBe(false);
  });

  it("derives the languageCode from currentLanguage", () => {
    const { result: de } = renderHook(() =>
      useLanguageMenuLogic(onChangeLanguage, "de"),
    );
    expect(de.current.languageCode).toBe("DE");

    const { result: en } = renderHook(() =>
      useLanguageMenuLogic(onChangeLanguage, "en"),
    );
    expect(en.current.languageCode).toBe("EN");
  });

  it("handleLanguageChange calls onChangeLanguage and closes the menu", async () => {
    onChangeLanguage.mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useLanguageMenuLogic(onChangeLanguage, "en"),
    );

    act(() => result.current.setMenuOpen(true));
    await act(() => result.current.handleLanguageChange("de"));

    expect(onChangeLanguage).toHaveBeenCalledWith("de");
    expect(result.current.menuOpen).toBe(false);
  });

  it("exposes a menuRef object", () => {
    const { result } = renderHook(() =>
      useLanguageMenuLogic(onChangeLanguage, "en"),
    );
    expect("current" in result.current.menuRef).toBe(true);
  });
});
