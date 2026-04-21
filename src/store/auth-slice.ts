import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
  username: string;
}

export interface AuthState {
  identityToken: string | null;
  user: AuthUser | null;
  bootstrapped: boolean;
}

const initialState: AuthState = {
  identityToken: null,
  user: null,
  bootstrapped: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIdentity: (
      state,
      action: PayloadAction<{ token: string; user: AuthUser | null }>,
    ) => {
      state.identityToken = action.payload.token;
      state.user = action.payload.user;
      state.bootstrapped = true;
    },
    clearIdentity: (state) => {
      state.identityToken = null;
      state.user = null;
      state.bootstrapped = true;
    },
    markBootstrapped: (state) => {
      state.bootstrapped = true;
    },
  },
});

export const { setIdentity, clearIdentity, markBootstrapped } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
