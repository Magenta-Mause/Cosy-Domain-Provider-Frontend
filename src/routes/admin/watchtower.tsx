import { createFileRoute } from "@tanstack/react-router";

import { WatchtowerTab } from "@/pages/admin/components/watchtower-tab";
import { getStoredAdminKey } from "@/pages/admin/lib";

export const Route = createFileRoute("/admin/watchtower")({
  component: RouteComponent,
});

function RouteComponent() {
  const adminKey = getStoredAdminKey();
  return <WatchtowerTab adminKey={adminKey} />;
}
