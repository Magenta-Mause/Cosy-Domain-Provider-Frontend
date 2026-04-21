import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SubdomainDto } from "@/api/generated/model";

export type SubdomainsStateStatus = "idle" | "loading" | "failed";

export interface SubdomainsState {
  items: SubdomainDto[];
  state: SubdomainsStateStatus;
  errorMessage: string | null;
}

const initialState: SubdomainsState = {
  items: [],
  state: "idle",
  errorMessage: null,
};

const subdomainsSlice = createSlice({
  name: "subdomains",
  initialState,
  reducers: {
    setSubdomainsState: (state, action: PayloadAction<SubdomainsStateStatus>) => {
      state.state = action.payload;
    },
    setSubdomains: (state, action: PayloadAction<SubdomainDto[]>) => {
      state.items = action.payload;
      state.errorMessage = null;
    },
    upsertSubdomain: (state, action: PayloadAction<SubdomainDto>) => {
      const uuid = action.payload.uuid;
      if (!uuid) {
        state.items = [action.payload, ...state.items];
        return;
      }

      const index = state.items.findIndex((item) => item.uuid === uuid);
      if (index === -1) {
        state.items = [action.payload, ...state.items];
        return;
      }

      state.items[index] = action.payload;
    },
    removeSubdomain: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.uuid !== action.payload);
    },
    clearSubdomains: (state) => {
      state.items = [];
      state.state = "idle";
      state.errorMessage = null;
    },
    setSubdomainsError: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload;
    },
  },
});

export const {
  setSubdomainsState,
  setSubdomains,
  upsertSubdomain,
  removeSubdomain,
  clearSubdomains,
  setSubdomainsError,
} = subdomainsSlice.actions;

export const subdomainsReducer = subdomainsSlice.reducer;
