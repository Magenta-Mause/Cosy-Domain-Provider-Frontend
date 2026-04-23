import { useTranslation } from "react-i18next";

import { FlatPanel } from "@/components/pixel/panel";
import useAuthInformation from "@/hooks/useAuthInformation/useAuthInformation";

import { ChangePasswordForm } from "./components/change-password-form";
import { ChangeUsernameForm } from "./components/change-username-form";
import { SettingsHeader } from "./components/settings-header";

export function SettingsPage() {
  const { t } = useTranslation();
  const { userName, updateUser } = useAuthInformation();

  return (
    <div className="min-h-screen bg-background">
      <SettingsHeader />
      <div className="flex flex-col p-[20px] max-w-[600px] mx-auto gap-5">
        <FlatPanel className="px-5 py-5 flex flex-col gap-6">
          <span className="pixel text-sm">{t("settings.usernameSection")}</span>
          <ChangeUsernameForm
            currentUsername={userName}
            onSave={(newUsername) => updateUser({ newUsername })}
          />
        </FlatPanel>

        <FlatPanel className="px-5 py-5 flex flex-col gap-6">
          <span className="pixel text-sm">{t("settings.passwordSection")}</span>
          <ChangePasswordForm
            onSave={(currentPassword, newPassword) =>
              updateUser({ currentPassword, newPassword })
            }
          />
        </FlatPanel>
      </div>
    </div>
  );
}
