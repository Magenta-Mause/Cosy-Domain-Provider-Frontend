import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useDropdown } from "./useDropdown";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("useDropdown", () => {
  it("starts closed", () => {
    const { result } = renderHook(() => useDropdown());
    expect(result.current.isOpen).toBe(false);
  });

  it("opens when setIsOpen(true) is called", () => {
    const { result } = renderHook(() => useDropdown());

    act(() => result.current.setIsOpen(true));

    expect(result.current.isOpen).toBe(true);
  });

  it("closes when setIsOpen(false) is called", () => {
    const { result } = renderHook(() => useDropdown());

    act(() => result.current.setIsOpen(true));
    act(() => result.current.setIsOpen(false));

    expect(result.current.isOpen).toBe(false);
  });

  it("closes on Escape key when open", () => {
    const { result } = renderHook(() => useDropdown());

    act(() => result.current.setIsOpen(true));

    act(() => {
      globalThis.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    expect(result.current.isOpen).toBe(false);
  });

  it("does not close on other keys when open", () => {
    const { result } = renderHook(() => useDropdown());

    act(() => result.current.setIsOpen(true));

    act(() => {
      globalThis.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    });

    expect(result.current.isOpen).toBe(true);
  });

  it("ignores Escape key when already closed", () => {
    const { result } = renderHook(() => useDropdown());

    act(() => {
      globalThis.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    expect(result.current.isOpen).toBe(false);
  });

  it("closes on mousedown outside the ref element", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const { result } = renderHook(() => useDropdown());

    act(() => {
      result.current.ref.current = container;
      result.current.setIsOpen(true);
    });

    const outside = document.createElement("button");
    document.body.appendChild(outside);

    act(() => {
      outside.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });

    expect(result.current.isOpen).toBe(false);
  });

  it("stays open on mousedown inside the ref element", () => {
    const container = document.createElement("div");
    const inner = document.createElement("span");
    container.appendChild(inner);
    document.body.appendChild(container);

    const { result } = renderHook(() => useDropdown());

    act(() => {
      result.current.ref.current = container;
      result.current.setIsOpen(true);
    });

    act(() => {
      inner.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    });

    expect(result.current.isOpen).toBe(true);
  });

  it("exposes a ref object", () => {
    const { result } = renderHook(() => useDropdown());
    expect(result.current.ref).toBeDefined();
    expect("current" in result.current.ref).toBe(true);
  });
});
