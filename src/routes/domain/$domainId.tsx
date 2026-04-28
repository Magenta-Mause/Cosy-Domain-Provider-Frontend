import { createFileRoute } from "@tanstack/react-router";
import { DomainDetailPage } from "@/pages/domain-detail";
import { requireFullAuth } from "@/lib/require-full-auth";

export const Route = createFileRoute("/domain/$domainId")({
  beforeLoad: requireFullAuth,
  component: RouteComponent,
});

function RouteComponent() {
  const { domainId } = Route.useParams();
  return <DomainDetailPage domainId={domainId} />;
}
