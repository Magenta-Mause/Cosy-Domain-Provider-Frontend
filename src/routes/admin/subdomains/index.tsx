import { createFileRoute } from "@tanstack/react-router";

import { SubdomainsTab } from "@/pages/admin/components/subdomains-tab";
import { getStoredAdminKey } from "@/pages/admin/lib";

export const Route = createFileRoute("/admin/subdomains/")({
  component: RouteComponent,
});

function RouteComponent() {
  const adminKey = getStoredAdminKey();
  return <SubdomainsTab adminKey={adminKey} />;
}
