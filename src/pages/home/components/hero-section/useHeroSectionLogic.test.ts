import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useHeroSectionLogic } from "./useHeroSectionLogic";

const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

describe("useHeroSectionLogic", () => {
  it("starts with an empty subdomain", () => {
    const { result } = renderHook(() => useHeroSectionLogic());
    expect(result.current.subdomain).toBe("");
  });

  it("sanitizes subdomain input on change", () => {
    const { result } = renderHook(() => useHeroSectionLogic());
    act(() => result.current.handleSubdomainChange("My Domain!"));
    expect(result.current.subdomain).toBe("mydomain");
  });

  it("allows lowercase letters, digits, and hyphens", () => {
    const { result } = renderHook(() => useHeroSectionLogic());
    act(() => result.current.handleSubdomainChange("my-domain-123"));
    expect(result.current.subdomain).toBe("my-domain-123");
  });

  it("handleCheckAvailability navigates to /register", () => {
    mockNavigate.mockResolvedValue(undefined);
    const { result } = renderHook(() => useHeroSectionLogic());
    act(() => result.current.handleCheckAvailability());
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/register" });
  });
});
