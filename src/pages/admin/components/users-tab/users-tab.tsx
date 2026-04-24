import { useTranslation } from "react-i18next";

import { UsersTable } from "./components/users-table";
import { useUsersTabLogic } from "./useUsersTabLogic";

interface UsersTabProps {
  adminKey: string;
}

export function UsersTab({ adminKey }: UsersTabProps) {
  const { t } = useTranslation();
  const { users, isLoading, error, handleUserClick } =
    useUsersTabLogic(adminKey);

  if (isLoading)
    return <p className="text-sm opacity-60 py-4">{t("admin.loading")}</p>;
  if (error)
    return <p className="text-sm text-destructive py-4">{error}</p>;

  return <UsersTable users={users} onUserClick={handleUserClick} />;
}
