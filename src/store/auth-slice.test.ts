import { describe, expect, it } from "vitest";
import {
  type AuthState,
  type AuthUser,
  authReducer,
  clearIdentity,
  clearPasswordSetup,
  markBootstrapped,
  setAuthState,
  setIdentity,
} from "./auth-slice";

const initialState: AuthState = {
  identityToken: null,
  user: null,
  bootstrapped: false,
  state: "idle",
};

const mockUser: AuthUser = {
  username: "alice",
  email: "alice@example.com",
  subject: "user-1",
  isVerified: true,
  needsPasswordSetup: false,
  isMfaEnabled: false,
  tier: "FREE",
  maxSubdomainCount: 3,
  issuedAt: 1700000000,
  expiresAt: 1700003600,
  claims: {},
};

describe("auth reducer", () => {
  describe("setAuthState", () => {
    it("updates the state field", () => {
      const result = authReducer(initialState, setAuthState("loading"));
      expect(result.state).toBe("loading");
    });

    it("sets failed state", () => {
      const result = authReducer(initialState, setAuthState("failed"));
      expect(result.state).toBe("failed");
    });
  });

  describe("setIdentity", () => {
    it("stores the token and user, resets state to idle", () => {
      const loading: AuthState = { ...initialState, state: "loading" };

      const result = authReducer(
        loading,
        setIdentity({ token: "tok123", user: mockUser }),
      );

      expect(result.identityToken).toBe("tok123");
      expect(result.user).toEqual(mockUser);
      expect(result.state).toBe("idle");
    });

    it("accepts a null user (token without parsed claims)", () => {
      const result = authReducer(
        initialState,
        setIdentity({ token: "tok456", user: null }),
      );

      expect(result.identityToken).toBe("tok456");
      expect(result.user).toBeNull();
    });
  });

  describe("clearIdentity", () => {
    it("clears token and user, marks bootstrapped, resets state to idle", () => {
      const loggedIn: AuthState = {
        identityToken: "tok123",
        user: mockUser,
        bootstrapped: false,
        state: "loading",
      };

      const result = authReducer(loggedIn, clearIdentity());

      expect(result.identityToken).toBeNull();
      expect(result.user).toBeNull();
      expect(result.bootstrapped).toBe(true);
      expect(result.state).toBe("idle");
    });
  });

  describe("markBootstrapped", () => {
    it("sets bootstrapped to true", () => {
      const result = authReducer(initialState, markBootstrapped());
      expect(result.bootstrapped).toBe(true);
    });

    it("does not touch other fields", () => {
      const result = authReducer(initialState, markBootstrapped());
      expect(result.identityToken).toBeNull();
      expect(result.user).toBeNull();
      expect(result.state).toBe("idle");
    });
  });

  describe("clearPasswordSetup", () => {
    it("sets needsPasswordSetup to false on the current user", () => {
      const state: AuthState = {
        ...initialState,
        user: { ...mockUser, needsPasswordSetup: true },
      };

      const result = authReducer(state, clearPasswordSetup());

      expect(result.user?.needsPasswordSetup).toBe(false);
    });

    it("is a no-op when there is no user", () => {
      const result = authReducer(initialState, clearPasswordSetup());
      expect(result.user).toBeNull();
    });
  });
});
