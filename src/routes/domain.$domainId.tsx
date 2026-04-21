import { createFileRoute, redirect } from "@tanstack/react-router";
import { DomainDetailPage } from "@/pages/domain-detail-page";
import { store } from "@/store/store";

export const Route = createFileRoute("/domain/$domainId")({
  beforeLoad: () => {
    const { identityToken } = store.getState().auth;
    if (!identityToken) {
      throw redirect({ to: "/login" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { domainId } = Route.useParams();
  return <DomainDetailPage domainId={domainId} />;
}
