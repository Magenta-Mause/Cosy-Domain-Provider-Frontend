import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

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
import useDataLoading from "@/hooks/useDataLoading/useDataLoading";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";

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
  const navigate = useNavigate();
  const { loadSubdomains } = useDataLoading();
  const subdomains = useAppSelector(
    (state) => state.subdomains.items,
  ) as SubdomainDto[];
  const isLoading = useAppSelector((state) => state.subdomains.state) === "loading";
  const isError = useAppSelector((state) => state.subdomains.state) === "failed";

  useEffect(() => {
    void loadSubdomains();
  }, [loadSubdomains]);

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle>{t("dashboard.title")}</CardTitle>
          <CardDescription>{t("dashboard.description")}</CardDescription>
        </div>
        <button
          type="button"
          className="pbtn sm"
          onClick={() => {
            void navigate({ to: "/domain/$domainId", params: { domainId: "new" } });
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("dashboard.createNew")}
        </button>
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
                </tr>
              </thead>
              <tbody>
                {subdomains.map((subdomain) => (
                  <tr key={subdomain.uuid} className="border-t">
                    <td className="px-4 py-3 font-medium">
                      {subdomain.uuid ? (
                        <div className="flex items-center gap-3">
                          <span>{subdomain.fqdn ?? subdomain.label}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              void navigate({
                                to: "/domain/$domainId",
                                params: { domainId: subdomain.uuid as string },
                              });
                            }}
                          >
                            {t("dashboard.open")}
                          </Button>
                        </div>
                      ) : (
                        (subdomain.fqdn ?? subdomain.label)
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {subdomain.targetIp}
                    </td>
                    <td className="px-4 py-3">
                      {subdomain.status ? (
                        <StatusBadge status={subdomain.status} />
                      ) : null}
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
