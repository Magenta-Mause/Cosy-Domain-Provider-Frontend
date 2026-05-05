import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useBillingLogic } from "./useBillingLogic";

vi.mock("@/hooks/useAuthInformation/useAuthInformation", () => ({
  default: vi.fn(),
}));

vi.mock("@/hooks/useDataInteractions/useDataInteractions", () => ({
  default: vi.fn(),
}));

const mockT = (key: string) => key;
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: mockT }),
}));

import useAuthInformation from "@/hooks/useAuthInformation/useAuthInformation";
import useDataInteractions from "@/hooks/useDataInteractions/useDataInteractions";

const mockOpenPortal = vi.fn();
const mockOpenCheckout = vi.fn();

function mockAuth(
  overrides: Partial<ReturnType<typeof useAuthInformation>> = {},
) {
  vi.mocked(useAuthInformation).mockReturnValue({
    userTier: "FREE",
    isVerified: true,
    ...overrides,
  } as unknown as ReturnType<typeof useAuthInformation>);
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useDataInteractions).mockReturnValue({
    openBillingPortal: mockOpenPortal,
    openCheckout: mockOpenCheckout,
  } as unknown as ReturnType<typeof useDataInteractions>);
  mockAuth();
});

describe("useBillingLogic", () => {
  it("isPlus is false for FREE tier", () => {
    mockAuth({ userTier: "FREE" });
    const { result } = renderHook(() => useBillingLogic());
    expect(result.current.isPlus).toBe(false);
  });

  it("isPlus is true for PLUS tier", () => {
    mockAuth({ userTier: "PLUS" });
    const { result } = renderHook(() => useBillingLogic());
    expect(result.current.isPlus).toBe(true);
  });

  describe("handlePortalClick", () => {
    it("sets verifyRequired error when user is not verified", async () => {
      mockAuth({ isVerified: false });
      const { result } = renderHook(() => useBillingLogic());

      await act(async () => {
        await result.current.handlePortalClick();
      });

      expect(result.current.error).toBe("billing.verifyRequired");
      expect(mockOpenPortal).not.toHaveBeenCalled();
      expect(mockOpenCheckout).not.toHaveBeenCalled();
    });

    it("calls openBillingPortal for a PLUS user", async () => {
      mockAuth({ userTier: "PLUS", isVerified: true });
      mockOpenPortal.mockResolvedValue(undefined);
      const { result } = renderHook(() => useBillingLogic());

      await act(async () => {
        await result.current.handlePortalClick();
      });

      expect(mockOpenPortal).toHaveBeenCalledOnce();
      expect(mockOpenCheckout).not.toHaveBeenCalled();
    });

    it("calls openCheckout for a FREE user", async () => {
      mockAuth({ userTier: "FREE", isVerified: true });
      mockOpenCheckout.mockResolvedValue(undefined);
      const { result } = renderHook(() => useBillingLogic());

      await act(async () => {
        await result.current.handlePortalClick();
      });

      expect(mockOpenCheckout).toHaveBeenCalledOnce();
      expect(mockOpenPortal).not.toHaveBeenCalled();
    });

    it("sets billing error and clears isRedirecting when portal throws", async () => {
      mockAuth({ userTier: "PLUS", isVerified: true });
      mockOpenPortal.mockRejectedValue(new Error("failed"));
      const { result } = renderHook(() => useBillingLogic());

      await act(async () => {
        await result.current.handlePortalClick();
      });

      expect(result.current.error).toBe("billing.error");
      expect(result.current.isRedirecting).toBe(false);
    });

    it("sets billing error and clears isRedirecting when checkout throws", async () => {
      mockAuth({ userTier: "FREE", isVerified: true });
      mockOpenCheckout.mockRejectedValue(new Error("failed"));
      const { result } = renderHook(() => useBillingLogic());

      await act(async () => {
        await result.current.handlePortalClick();
      });

      expect(result.current.error).toBe("billing.error");
      expect(result.current.isRedirecting).toBe(false);
    });
  });
});
