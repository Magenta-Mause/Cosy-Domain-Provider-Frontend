import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { type AdminUser, adminApi } from "../../lib";

export function useUsersTabLogic(adminKey: string) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    adminApi
      .getUsers(adminKey)
      .then(setUsers)
      .catch(() => setError(t("admin.loadUsersError")))
      .finally(() => setIsLoading(false));
  }, [adminKey, t]);

  const handleUserClick = (userId: string) => {
    void navigate({ to: "/admin/users/$userId", params: { userId } });
  };

  return { users, isLoading, error, handleUserClick };
}
