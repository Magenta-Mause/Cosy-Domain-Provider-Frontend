import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";

import { AppShell } from "@/components/layout/app-shell";
import { AboutPage } from "@/pages/about-page";
import { CreateSubdomainPage } from "@/pages/create-subdomain-page";
import { DashboardPage } from "@/pages/dashboard-page";
import { HomePage } from "@/pages/home-page";
import { LoginPage } from "@/pages/login-page";
import { store } from "@/store/store";

function requireAuth() {
  const { identityToken } = store.getState().auth;
  if (!identityToken) {
    throw redirect({ to: "/login" });
  }
}

function redirectIfAuthed() {
  const { identityToken } = store.getState().auth;
  if (identityToken) {
    throw redirect({ to: "/dashboard" });
  }
}

const rootRoute = createRootRoute({
  component: AppShell,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: redirectIfAuthed,
  component: LoginPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  beforeLoad: requireAuth,
  component: DashboardPage,
});

const createSubdomainRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/subdomain/new",
  beforeLoad: requireAuth,
  component: CreateSubdomainPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  loginRoute,
  dashboardRoute,
  createSubdomainRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
