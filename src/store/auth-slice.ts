import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
  username: string | null;
  email: string | null;
  isVerified: boolean | null;
  needsPasswordSetup: boolean;
  plan: "FREE" | "PLUS" | null;
  subject: string | null;
  issuedAt: number | null;
  expiresAt: number | null;
  claims: Record<string, unknown>;
}

export interface AuthState {
  identityToken: string | null;
  user: AuthUser | null;
  bootstrapped: boolean;
  state: "idle" | "loading" | "failed";
}

const initialState: AuthState = {
  identityToken: null,
  user: null,
  bootstrapped: false,
  state: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<AuthState["state"]>) => {
      state.state = action.payload;
    },
    setIdentity: (
      state,
      action: PayloadAction<{ token: string; user: AuthUser | null }>,
    ) => {
      state.identityToken = action.payload.token;
      state.user = action.payload.user;
      state.bootstrapped = true;
      state.state = "idle";
    },
    clearIdentity: (state) => {
      state.identityToken = null;
      state.user = null;
      state.bootstrapped = true;
      state.state = "idle";
    },
    markBootstrapped: (state) => {
      state.bootstrapped = true;
    },
    clearPasswordSetup: (state) => {
      if (state.user) {
        state.user.needsPasswordSetup = false;
      }
    },
  },
});

export const {
  setAuthState,
  setIdentity,
  clearIdentity,
  markBootstrapped,
  clearPasswordSetup,
} = authSlice.actions;
export const authReducer = authSlice.reducer;
