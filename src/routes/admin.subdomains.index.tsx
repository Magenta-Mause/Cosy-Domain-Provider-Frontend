import { createFileRoute } from "@tanstack/react-router";

import { SubdomainsTab } from "@/pages/admin/components/subdomains-tab";
import { ADMIN_KEY_STORAGE } from "@/pages/admin/lib";

export const Route = createFileRoute("/admin/subdomains/")({
  component: RouteComponent,
});

function RouteComponent() {
  const adminKey = sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? "";
  return <SubdomainsTab adminKey={adminKey} />;
}
