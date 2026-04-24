import { createFileRoute, useRouter } from "@tanstack/react-router";
import { UserDetail } from "@/pages/admin/components/users-tab";
import { ADMIN_KEY_STORAGE, adminApi } from "@/pages/admin/lib";

export const Route = createFileRoute("/admin/users/$userId")({
  loader: ({ params }) => {
    const key = sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? "";
    return adminApi.getUserDetail(key, params.userId);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const detail = Route.useLoaderData();
  const router = useRouter();
  const adminKey = sessionStorage.getItem(ADMIN_KEY_STORAGE) ?? "";

  return (
    <UserDetail
      detail={detail}
      adminKey={adminKey}
      onSaved={() => router.invalidate()}
    />
  );
}
