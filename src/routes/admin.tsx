import {
  createFileRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { AdminAuthGate } from "@/pages/admin";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
});

function RouteComponent() {
  const { location } = useRouterState();
  const activeTab = location.pathname.startsWith("/admin/users")
    ? "users"
    : location.pathname.startsWith("/admin/watchtower")
      ? "watchtower"
      : "subdomains";

  return <AdminAuthGate activeTab={activeTab} outlet={<Outlet />} />;
}
