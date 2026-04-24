import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { type AdminSubdomain, adminApi } from "../../lib";

export function useSubdomainsTabLogic(adminKey: string) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [subdomains, setSubdomains] = useState<AdminSubdomain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    adminApi
      .getSubdomains(adminKey)
      .then(setSubdomains)
      .catch(() => setError(t("admin.loadSubdomainsError")))
      .finally(() => setIsLoading(false));
  }, [adminKey, t]);

  const total = subdomains.length;
  const failed = subdomains.filter((s) => s.status === "FAILED").length;

  const handleSubdomainClick = (subdomainId: string) =>
    void navigate({
      to: "/admin/subdomains/$subdomainId",
      params: { subdomainId },
    });

  return { isLoading, error, subdomains, total, failed, handleSubdomainClick };
}
