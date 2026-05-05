import { configureStore } from "@reduxjs/toolkit";
import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { authReducer } from "@/store/auth-slice";
import { settingsReducer } from "@/store/settings-slice";
import type { RootState } from "@/store/store";
import { subdomainsReducer } from "@/store/subdomains-slice";

export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      auth: authReducer as never,
      subdomains: subdomainsReducer as never,
      settings: settingsReducer as never,
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
