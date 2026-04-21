import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import "@/i18n/config";
import { AuthProvider } from "@/providers/auth-provider";
import { router } from "@/router";
import { store } from "@/store/store";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element was not found");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);
