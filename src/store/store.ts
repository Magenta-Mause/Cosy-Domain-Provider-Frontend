import { configureStore } from "@reduxjs/toolkit";

import { authReducer } from "@/store/auth-slice";
import { counterReducer } from "@/store/counter-slice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
