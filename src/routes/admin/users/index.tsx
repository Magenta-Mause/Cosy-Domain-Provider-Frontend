import { createFileRoute } from "@tanstack/react-router";
import { UsersTab } from "@/pages/admin/components/users-tab";
import { ADMIN_KEY_STORAGE } from "@/pages/admin/lib";

export const Route = createFileRoute("/admin/users/")({
  component: RouteComponent,
});

function RouteComponent() {
  const adminKey = sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? "";
  return <UsersTab adminKey={adminKey} />;
}
