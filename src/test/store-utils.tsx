import { configureStore } from "@reduxjs/toolkit";
import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { authReducer } from "@/store/auth-slice";
import { settingsReducer } from "@/store/settings-slice";
import { subdomainsReducer } from "@/store/subdomains-slice";
import type { RootState } from "@/store/store";

export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      auth: authReducer,
      subdomains: subdomainsReducer,
      settings: settingsReducer,
    },
    preloadedState,
  });
}

export function makeWrapper(preloadedState?: Partial<RootState>) {
  const store = makeStore(preloadedState);
  return function Wrapper({ children }: PropsWithChildren) {
    return <Provider store={store}>{children}</Provider>;
  };
}
