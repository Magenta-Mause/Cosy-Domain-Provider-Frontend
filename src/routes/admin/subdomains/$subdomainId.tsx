import { createFileRoute, useRouter } from "@tanstack/react-router";

import { adminApi } from "@/api/admin-api";
import { SubdomainDetail } from "@/pages/admin/components/subdomains-tab";
import { getStoredAdminKey } from "@/pages/admin/lib";

export const Route = createFileRoute("/admin/subdomains/$subdomainId")({
  loader: ({ params }) =>
    adminApi.getSubdomainDetail(getStoredAdminKey(), params.subdomainId),
  component: RouteComponent,
});

function RouteComponent() {
  const subdomain = Route.useLoaderData();
  const router = useRouter();

  return (
    <SubdomainDetail
      subdomain={subdomain}
      adminKey={getStoredAdminKey()}
      onSaved={() => router.invalidate()}
    />
  );
}
