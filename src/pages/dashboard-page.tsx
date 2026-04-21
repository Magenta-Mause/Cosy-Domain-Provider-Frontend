import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  getListMySubdomainsQueryKey,
  useDeleteSubdomain,
  useListMySubdomains,
} from "@/api/generated/domain-provider-api";
import type { SubdomainDto } from "@/api/generated/model";
import { SubdomainDtoStatus } from "@/api/generated/model";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const statusStyles: Record<SubdomainDtoStatus, string> = {
  [SubdomainDtoStatus.ACTIVE]: "bg-green-100 text-green-800",
  [SubdomainDtoStatus.PENDING]: "bg-yellow-100 text-yellow-800",
  [SubdomainDtoStatus.FAILED]: "bg-red-100 text-red-800",
};

function StatusBadge({ status }: { status: SubdomainDtoStatus }) {
  const { t } = useTranslation();
  const label =
    status === SubdomainDtoStatus.ACTIVE
      ? t("status.active")
      : status === SubdomainDtoStatus.PENDING
        ? t("status.pending")
        : t("status.failed");
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status],
      )}
    >
      {label}
    </span>
  );
}

export function DashboardPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useListMySubdomains();
  const deleteMutation = useDeleteSubdomain({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: getListMySubdomainsQueryKey(),
        });
      },
    },
  });

  const subdomains: SubdomainDto[] = data ?? [];

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle>{t("dashboard.title")}</CardTitle>
          <CardDescription>{t("dashboard.description")}</CardDescription>
        </div>
        <Link
          to="/subdomain/new"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("dashboard.register")}
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : isError ? (
          <p className="text-sm text-red-600">{t("dashboard.loadError")}</p>
        ) : subdomains.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("dashboard.empty")}
          </p>
        ) : (
          <div className="overflow-hidden rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">{t("dashboard.columnLabel")}</th>
                  <th className="px-4 py-2">{t("dashboard.columnTarget")}</th>
                  <th className="px-4 py-2">{t("dashboard.columnStatus")}</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {subdomains.map((subdomain) => (
                  <tr key={subdomain.uuid} className="border-t">
                    <td className="px-4 py-3 font-medium">
                      {subdomain.fqdn ?? subdomain.label}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {subdomain.targetIp}
                    </td>
                    <td className="px-4 py-3">
                      {subdomain.status ? (
                        <StatusBadge status={subdomain.status} />
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={
                          deleteMutation.isPending &&
                          deleteMutation.variables?.uuid === subdomain.uuid
                        }
                        onClick={() => {
                          if (!subdomain.uuid) return;
                          deleteMutation.mutate({ uuid: subdomain.uuid });
                        }}
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        {deleteMutation.isPending &&
                        deleteMutation.variables?.uuid === subdomain.uuid
                          ? t("dashboard.deleting")
                          : t("dashboard.delete")}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
