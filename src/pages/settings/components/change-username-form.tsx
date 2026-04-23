import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ErrorMessage } from "@/components/pixel/error-message";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { isValidUsername } from "@/pages/register/components/register-form/lib";

interface ChangeUsernameFormProps {
  currentUsername: string | null;
  onSave: (newUsername: string) => Promise<void>;
}

export function ChangeUsernameForm({
  currentUsername,
  onSave,
}: ChangeUsernameFormProps) {
  const { t } = useTranslation();
  const [newUsername, setNewUsername] = useState<string>(
    () => currentUsername ?? "",
  );
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    isValidUsername(newUsername) && newUsername !== currentUsername;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await onSave(newUsername);
      setSuccess(true);
      setNewUsername(newUsername);
    } catch {
      setError(t("settings.usernameError"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <InputField
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
