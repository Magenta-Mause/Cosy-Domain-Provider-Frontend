import { Outlet } from "@tanstack/react-router";
import { AppHeader } from "@/components/layout/app-header";

export function AppShell() {
  return (
    <div>
      <AppHeader />
      <Outlet />
    </div>
  );
}
