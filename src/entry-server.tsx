import "@/i18n/config";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from "@tanstack/react-router";
import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import { routeTree } from "@/routeTree.gen";
import { authReducer } from "@/store/auth-slice";
import { settingsReducer } from "@/store/settings-slice";
import { subdomainsReducer } from "@/store/subdomains-slice";

export async function render(url: string): Promise<string> {
  const ssrStore = configureStore({
    reducer: {
      auth: authReducer,
      subdomains: subdomainsReducer,
      settings: settingsReducer,
    },
    preloadedState: {
      auth: {
        bootstrapped: true,
        state: "idle" as const,
        identityToken: null,
        user: null,
      },
    },
  });

  const queryClient = new QueryClient();
  const memoryHistory = createMemoryHistory({ initialEntries: [url] });
  const ssrRouter = createRouter({ routeTree, history: memoryHistory });
  await ssrRouter.load();

  return renderToString(
    <Provider store={ssrStore}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={ssrRouter} />
      </QueryClientProvider>
    </Provider>,
  );
}
