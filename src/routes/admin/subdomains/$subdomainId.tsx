import { createFileRoute } from "@tanstack/react-router";

import { SubdomainDetail } from "@/pages/admin/components/subdomains-tab";
import { ADMIN_KEY_STORAGE, adminApi } from "@/pages/admin/lib";

export const Route = createFileRoute("/admin/subdomains/$subdomainId")({
  loader: ({ params }) => {
    const key = sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? "";
    return adminApi.getSubdomainDetail(key, params.subdomainId);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const subdomain = Route.useLoaderData();
  return <SubdomainDetail subdomain={subdomain} />;
}
