import { createFileRoute, useRouter } from "@tanstack/react-router";

import { adminApi } from "@/api/admin-api";
import { UserDetail } from "@/pages/admin/components/users-tab";
import { getStoredAdminKey } from "@/pages/admin/lib";

export const Route = createFileRoute("/admin/users/$userId")({
  loader: ({ params }) =>
    adminApi.getUserDetail(getStoredAdminKey(), params.userId),
  component: RouteComponent,
});

function RouteComponent() {
  const detail = Route.useLoaderData();
  const router = useRouter();

  return (
    <UserDetail
      detail={detail}
      adminKey={getStoredAdminKey()}
      onSaved={() => router.invalidate()}
    />
  );
}
