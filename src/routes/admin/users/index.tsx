import { createFileRoute } from "@tanstack/react-router";
import { UsersTab } from "@/pages/admin/components/users-tab";
import { getStoredAdminKey } from "@/pages/admin/lib";

export const Route = createFileRoute("/admin/users/")({
  component: RouteComponent,
});

function RouteComponent() {
  const adminKey = getStoredAdminKey();
  return <UsersTab adminKey={adminKey} />;
}
