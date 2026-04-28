import { Outlet } from "@tanstack/react-router";

import { AppFooter } from "./app-footer";

export function AppShell() {
  return (
    <>
      <Outlet />
      <AppFooter />
    </>
  );
}
