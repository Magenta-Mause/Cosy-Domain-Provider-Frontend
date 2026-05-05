import { beforeEach, describe, expect, it, vi } from "vitest";
import { requireFullAuth } from "./require-full-auth";

vi.mock("@tanstack/react-router", () => ({
  redirect: vi.fn((args: { to: string }) => ({ _isRedirect: true, ...args })),
}));

vi.mock("@/store/store", () => ({
  store: { getState: vi.fn() },
}));

import { redirect } from "@tanstack/react-router";
import { store } from "@/store/store";

function mockAuthState(overrides: {
  identityToken?: string | null;
  isVerified?: boolean | null;
  isMfaEnabled?: boolean;
}) {
  vi.mocked(store.getState).mockReturnValue({
    auth: {
      identityToken: "identityToken" in overrides ? overrides.identityToken : "tok",
      user:
        overrides.identityToken === null
          ? null
          : {
              isVerified: overrides.isVerified ?? true,
              isMfaEnabled: overrides.isMfaEnabled ?? true,
            },
    },
  } as ReturnType<typeof store.getState>);
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(redirect).mockImplementation((args: { to: string }) => ({
    _isRedirect: true,
    ...args,
  }) as unknown as never);
});

describe("requireFullAuth", () => {
  it("throws a redirect to /login when there is no identity token", () => {
    mockAuthState({ identityToken: null });

    expect(() => requireFullAuth()).toThrow();
    expect(redirect).toHaveBeenCalledWith({ to: "/login" });
  });

  it("throws a redirect to /verify when the user is not verified", () => {
    mockAuthState({ identityToken: "tok", isVerified: false });

    expect(() => requireFullAuth()).toThrow();
    expect(redirect).toHaveBeenCalledWith({ to: "/verify" });
  });

  it("throws a redirect to /mfa-setup when MFA is not enabled", () => {
    mockAuthState({ identityToken: "tok", isVerified: true, isMfaEnabled: false });

    expect(() => requireFullAuth()).toThrow();
    expect(redirect).toHaveBeenCalledWith({ to: "/mfa-setup" });
  });

  it("does not throw when fully authenticated", () => {
    mockAuthState({ identityToken: "tok", isVerified: true, isMfaEnabled: true });

    expect(() => requireFullAuth()).not.toThrow();
  });
});
