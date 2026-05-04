import { useTranslation } from "react-i18next";

import { ErrorMessage } from "@/components/pixel/error-message";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";

import { useChangeUsernameFormLogic } from "./useChangeUsernameFormLogic";

interface ChangeUsernameFormProps {
  readonly currentUsername: string | null;
  readonly onSave: (newUsername: string) => Promise<void>;
}

export function ChangeUsernameForm({
  currentUsername,
  onSave,
}: ChangeUsernameFormProps) {
  const { t } = useTranslation();
  const {
    newUsername,
    setNewUsername,
    saving,
    success,
    error,
    canSubmit,
    handleSubmit,
  } = useChangeUsernameFormLogic(currentUsername, onSave);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormField
        id="new-username"
        label={t("settings.newUsername")}
        type="text"
        autoComplete="username"
        required
        minLength={3}
        maxLength={20}
        placeholder={currentUsername ?? "your-username"}
        value={newUsername}
        onChange={setNewUsername}
        disabled={saving}
        testId="settings-new-username-input"
      />
      {success && (
        <div className="text-xl text-accent-2">
          {t("settings.usernameSuccess")}
        </div>
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Button
        type="submit"
        data-testid="settings-username-submit-btn"
        disabled={!canSubmit || saving}
        className="w-fit"
      >
        {saving ? t("settings.saving") : t("settings.saveButton")}
      </Button>
    </form>
  );
}
