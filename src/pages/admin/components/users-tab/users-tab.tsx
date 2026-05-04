import { useTranslation } from "react-i18next";

import { UserStats } from "./components/user-stats";
import { UsersTable } from "./components/users-table";
import { useUsersTabLogic } from "./useUsersTabLogic";

interface UsersTabProps {
  readonly adminKey: string;
}

export function UsersTab({ adminKey }: UsersTabProps) {
  const { t } = useTranslation();
  const { users, isLoading, error, total, unverified, plus, handleUserClick } =
    useUsersTabLogic(adminKey);

  if (isLoading)
    return <p className="text-sm opacity-60 py-4">{t("admin.loading")}</p>;
  if (error) return <p className="text-sm text-destructive py-4">{error}</p>;

  return (
    <div className="flex flex-col gap-4">
      <UserStats total={total} unverified={unverified} plus={plus} />
      <UsersTable users={users} onUserClick={handleUserClick} />
    </div>
  );
}
