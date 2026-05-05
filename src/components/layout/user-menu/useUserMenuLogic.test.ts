import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useUserMenuLogic } from "./useUserMenuLogic";

describe("useUserMenuLogic", () => {
  it("starts with the menu closed", () => {
    const { result } = renderHook(() => useUserMenuLogic("alice"));
    expect(result.current.menuOpen).toBe(false);
  });

  it("derives the initial from the username", () => {
    const { result } = renderHook(() => useUserMenuLogic("alice"));
    expect(result.current.initial).toBe("A");
  });

  it("uses ? as initial when username is null", () => {
    const { result } = renderHook(() => useUserMenuLogic(null));
    expect(result.current.initial).toBe("?");
  });

  it("uses ? as initial when username is undefined", () => {
    const { result } = renderHook(() => useUserMenuLogic(undefined));
    expect(result.current.initial).toBe("?");
  });

  it("exposes setMenuOpen to control the open state", () => {
    const { result } = renderHook(() => useUserMenuLogic("alice"));

    act(() => result.current.setMenuOpen(true));
    expect(result.current.menuOpen).toBe(true);

    act(() => result.current.setMenuOpen(false));
    expect(result.current.menuOpen).toBe(false);
  });

  it("exposes a menuRef object", () => {
    const { result } = renderHook(() => useUserMenuLogic("alice"));
    expect("current" in result.current.menuRef).toBe(true);
  });
});
